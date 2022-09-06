#!/bin/bash

# LOAD PARAMETERS
source parameters

if [ $Env = "dev" ]; then
	echo "Nothinbg to do for \"dev\" environment..."
	exit 2
fi

# DELETE OLD STACK IF EXIST ON CTRL+C
trap "echo; echo \"DELETING THE STACK\"; bash destroy.sh -e ${Env} -p ${Project} -t ${Target} -g ${GitUsername}; exit" INT

# GET SECTRETS
FontAwesomeKey=$(echo ${Secrets} | jq .SecretString | jq -rc . | jq -rc '.FontAwesomeKey')
AcmArn=$(echo ${Secrets} | jq .SecretString | jq -rc . | jq -rc '.AcmArn')
HostedZoneId=$(echo ${Secrets} | jq .SecretString | jq -rc . | jq -rc '.HostedZoneId')

# GET URL FROM S3 AND SET VARIABLES
aws s3 cp ${Urls} ./urls.json
Url=$(cat urls.json | jq ".${Target}.${Env}" | tr -d '"')
ApiUrl=$(cat urls.json | jq ".administration.${Env}" | tr -d '"')

# UPLOAD SOURCE TO S3
aws s3 mb s3://${URI}-source/
sed "s/__FontAwesomeKey__/${FontAwesomeKey}/g" ${RootFolder}/.npmrc.template >${RootFolder}/.npmrc
aws s3 sync ${RootFolder} s3://${URI}-source/ \
	--exclude "node_modules/*" \
	--exclude "build/*" \
	--exclude "deploy/*" \
	--exclude ".github/*" \
	--exclude ".git"

# SAM BUILD AND DEPLOY
Parameters="ParameterKey=URI,ParameterValue=${URI} ParameterKey=AcmArn,ParameterValue=${AcmArn} ParameterKey=Url,ParameterValue=${Url} ParameterKey=HostedZoneId,ParameterValue=${HostedZoneId}"

sam build -t ./template.yml --parameter-overrides ${Parameters}
sam deploy \
	--template-file .aws-sam/build/template.yaml \
	--stack-name ${URI} \
	--disable-rollback \
	--resolve-s3 \
	--parameter-overrides ${Parameters} \
	--capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
	--tags project=${Project} env=${Env} creator=${GitUsername}

# BUILT REACT WITH CODEBUILD
DistributionId=$(aws cloudformation describe-stacks --stack-name $URI --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionID'].OutputValue" --output text)
aws codebuild start-build \
	--project-name "${URI}-builder" \
	--environment-variables-override name=ApiUrl,value=${ApiUrl},type=PLAINTEXT name=DistributionId,value=${DistributionId},type=PLAINTEXT name=DeployBucket,value=${Url},type=PLAINTEXT

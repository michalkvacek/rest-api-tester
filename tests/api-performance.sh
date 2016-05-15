#!/bin/bash

TEST_ID=1
ENVIRONMENT_ID=1
PROJECT_ID=1
TEST_RESULT_ID=1
REQUEST_ID=1

# -----------------------------------

AUTH_TOKEN=$1
REQUEST_CNT=10
CONCURRENCY=3
BASEURL="http://rest.kvacek.cz"

ROUTES="/api/v1/assertions/types
	/api/v1/environments/:environmentId
	/api/v1/environments/:environmentId/auths
	/api/v1/environments/:environmentId/requests
	/api/v1/environments/:environmentId/tests
	/api/v1/headers
	/api/v1/projects
	/api/v1/projects/:projectId
	/api/v1/projects/:projectId/environments
	/api/v1/projects/:projectId/versions
	/api/v1/requests/:requestId
	/api/v1/requests/:requestId/assertions
	/api/v1/requests/:requestId/httpParameters
	/api/v1/requests/:requestId/lastResponse
	/api/v1/testResults
	/api/v1/testResults/:testResultId
	/api/v1/tests/statistics
	/api/v1/tests/:testId
	/api/v1/users/me"


ROUTES=`echo $ROUTES | sed "s/:projectId/$PROJECT_ID/g" | sed "s/:testId/$TEST_ID/g" | sed "s/:requestId/$REQUEST_ID/g" | sed "s/:environmentId/$ENVIRONMENT_ID/g" | sed "s/:testResultId/$TEST_RESULT_ID/g"`

for ROUTE in $ROUTES; do
   URL=`echo $BASEURL$ROUTE?token=$AUTH_TOKEN`

   echo ""
   echo $ROUTE
   ab -n $REQUEST_CNT -c $CONCURRENCY $URL | grep "Time per request"
done;
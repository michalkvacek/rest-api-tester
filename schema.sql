-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.8.2-beta1
-- PostgreSQL version: 9.5
-- Project Site: pgmodeler.com.br
-- Model Author: ---


-- Database creation must be done outside an multicommand file.
-- These commands were put in this file only for convenience.
-- -- object: test_rest_api | type: DATABASE --
-- -- DROP DATABASE IF EXISTS test_rest_api;
-- CREATE DATABASE test_rest_api
-- ;
-- -- ddl-end --
-- 

-- object: public.users | type: TABLE --
-- DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users(
	id serial NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	name varchar(128) NOT NULL,
	email varchar(256) NOT NULL,
	password varchar(256) NOT NULL,
	active boolean NOT NULL DEFAULT false,
	CONSTRAINT primary_key PRIMARY KEY (id),
	CONSTRAINT unique_email UNIQUE (email)

);
-- ddl-end --
ALTER TABLE public.users OWNER TO postgres;
-- ddl-end --

-- object: active_user | type: INDEX --
-- DROP INDEX IF EXISTS public.active_user CASCADE;
CREATE INDEX active_user ON public.users
	USING btree
	(
	  active
	);
-- ddl-end --

-- object: email | type: INDEX --
-- DROP INDEX IF EXISTS public.email CASCADE;
CREATE INDEX email ON public.users
	USING btree
	(
	  email
	);
-- ddl-end --

-- object: public.projects | type: TABLE --
-- DROP TABLE IF EXISTS public.projects CASCADE;
CREATE TABLE public.projects(
	id serial NOT NULL,
	"usersId" integer NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	name varchar(256) NOT NULL,
	description text,
	CONSTRAINT id PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.projects OWNER TO postgres;
-- ddl-end --

-- object: public.enviroments | type: TABLE --
-- DROP TABLE IF EXISTS public.enviroments CASCADE;
CREATE TABLE public.enviroments(
	id serial NOT NULL,
	"projectsId" integer NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	"apiEndpoint" text NOT NULL,
	name varchar(256) NOT NULL,
	description text,
	CONSTRAINT primary_key_4 PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.enviroments OWNER TO postgres;
-- ddl-end --

-- object: public.tests | type: TABLE --
-- DROP TABLE IF EXISTS public.tests CASCADE;
CREATE TABLE public.tests(
	id serial NOT NULL,
	"environmentsId" integer NOT NULL,
	"usersId" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT NOW(),
	"updatedAt" timestamp with time zone,
	name varchar(128) NOT NULL,
	description text,
	"nextRun" timestamp,
	"runInterval" tinterval,
	active boolean DEFAULT true,
	CONSTRAINT primary_key_3 PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.tests OWNER TO postgres;
-- ddl-end --

-- object: next_test_run | type: INDEX --
-- DROP INDEX IF EXISTS public.next_test_run CASCADE;
CREATE INDEX next_test_run ON public.tests
	USING btree
	(
	  "nextRun"
	);
-- ddl-end --

-- object: is_test_active | type: INDEX --
-- DROP INDEX IF EXISTS public.is_test_active CASCADE;
CREATE INDEX is_test_active ON public.tests
	USING btree
	(
	  active
	);
-- ddl-end --

-- object: public."testParts" | type: TABLE --
-- DROP TABLE IF EXISTS public."testParts" CASCADE;
CREATE TABLE public."testParts"(
	id serial NOT NULL,
	"usersId" integer,
	"parentTestPartId" integer,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	name varchar(126) NOT NULL,
	description text,
	CONSTRAINT test_part_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public."testParts" OWNER TO postgres;
-- ddl-end --

-- object: public.versions | type: TABLE --
-- DROP TABLE IF EXISTS public.versions CASCADE;
CREATE TABLE public.versions(
	id serial NOT NULL,
	"usersId" integer NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	name varchar(126) NOT NULL,
	description text,
	"urlSegment" varchar(64),
	CONSTRAINT primary_key_1 PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.versions OWNER TO postgres;
-- ddl-end --

-- object: public."responseHeaders" | type: TABLE --
-- DROP TABLE IF EXISTS public."responseHeaders" CASCADE;
CREATE TABLE public."responseHeaders"(
	id serial NOT NULL,
	"responsesId" integer NOT NULL,
	name varchar(256),
	value varchar(256),
	CONSTRAINT response_header_primary_key PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public."responseHeaders" OWNER TO postgres;
-- ddl-end --

-- object: public."evaluatedAsserions" | type: TABLE --
-- DROP TABLE IF EXISTS public."evaluatedAsserions" CASCADE;
CREATE TABLE public."evaluatedAsserions"(
	id serial NOT NULL,
	"responsesId" integer NOT NULL,
	"requestsId" integer NOT NULL,
	"createdAt" timestamp with time zone,
	"assertionType" varchar(64) NOT NULL,
	"assertionName" varchar(126) NOT NULL,
	"assertionProperty" text,
	"assertionExpectedValue" text,
	"assertionExtraCode" text,
	"recievedValue" text,
	passed boolean NOT NULL,
	CONSTRAINT evaluated_assertions_primary_key PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public."evaluatedAsserions" OWNER TO postgres;
-- ddl-end --

-- object: public."requestHeaders" | type: TABLE --
-- DROP TABLE IF EXISTS public."requestHeaders" CASCADE;
CREATE TABLE public."requestHeaders"(
	id serial NOT NULL,
	"responsesId" integer NOT NULL,
	name varchar(256),
	value varchar(256),
	CONSTRAINT response_header_primary_key_1 PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public."requestHeaders" OWNER TO postgres;
-- ddl-end --

-- object: public.assertions | type: TABLE --
-- DROP TABLE IF EXISTS public.assertions CASCADE;
CREATE TABLE public.assertions(
	id serial NOT NULL,
	type varchar(64) NOT NULL,
	name varchar(126) NOT NULL,
	description text,
	"extraCode" text,
	CONSTRAINT assertion_primary_key PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.assertions OWNER TO postgres;
-- ddl-end --

-- object: public.requests | type: TABLE --
-- DROP TABLE IF EXISTS public.requests CASCADE;
CREATE TABLE public.requests(
	id serial NOT NULL,
	"versionsId" integer,
-- 	"usersId" integer,
-- 	"parentTestPartId" integer,
-- 	"createdAt" timestamp with time zone,
-- 	"updatedAt" timestamp with time zone,
-- 	name varchar(126) NOT NULL,
-- 	description text,
	url text NOT NULL,
	"resourceName" varchar(256),
	"methodName" varchar(256),
	"httpMethod" varchar(126),
	CONSTRAINT requests_pk PRIMARY KEY (id)

) INHERITS(public."testParts")
;
-- ddl-end --
ALTER TABLE public.requests OWNER TO postgres;
-- ddl-end --

-- object: public.response_status | type: TYPE --
-- DROP TYPE IF EXISTS public.response_status CASCADE;
CREATE TYPE public.response_status AS
 ENUM ('waiting_for_response','evaluating','failed','success');
-- ddl-end --
ALTER TYPE public.response_status OWNER TO postgres;
-- ddl-end --

-- object: public.users_roles | type: TYPE --
-- DROP TYPE IF EXISTS public.users_roles CASCADE;
CREATE TYPE public.users_roles AS
 ENUM ('host','manager','tester');
-- ddl-end --
ALTER TYPE public.users_roles OWNER TO postgres;
-- ddl-end --

-- object: public.response | type: TABLE --
-- DROP TABLE IF EXISTS public.response CASCADE;
CREATE TABLE public.response(
	id serial NOT NULL,
	"requestsId" integer NOT NULL,
	"createdAt" timestamp with time zone,
	"requestUrl" text NOT NULL,
	"requestQueryString" json,
	"requestHttpParameters" json,
	"responseTime" integer NOT NULL,
	"reponseCode" smallint NOT NULL,
	"responseSize" integer NOT NULL,
	"responseBodyJson" json,
	"responseBodyXml" xml,
	"responseBodyRaw" text NOT NULL,
	"passedAssertions" boolean,
	status public.response_status NOT NULL,
	CONSTRAINT response_primary_key PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.response OWNER TO postgres;
-- ddl-end --

-- object: public.comparision_operator | type: TYPE --
-- DROP TYPE IF EXISTS public.comparision_operator CASCADE;
CREATE TYPE public.comparision_operator AS
 ENUM ('=','!=','<','<=','>','=>');
-- ddl-end --
ALTER TYPE public.comparision_operator OWNER TO postgres;
-- ddl-end --

-- object: public."requestConditions" | type: TABLE --
-- DROP TABLE IF EXISTS public."requestConditions" CASCADE;
CREATE TABLE public."requestConditions"(
-- 	id integer NOT NULL,
-- 	"usersId" integer,
-- 	"parentTestPartId" integer,
-- 	"createdAt" timestamp with time zone,
-- 	"updatedAt" timestamp with time zone,
-- 	name varchar(126) NOT NULL,
-- 	description text,
	property text NOT NULL,
	operator public.comparision_operator NOT NULL,
	value text
) INHERITS(public."testParts")
;
-- ddl-end --
ALTER TABLE public."requestConditions" OWNER TO postgres;
-- ddl-end --

-- object: public.delays | type: TABLE --
-- DROP TABLE IF EXISTS public.delays CASCADE;
CREATE TABLE public.delays(
-- 	id integer NOT NULL,
-- 	"usersId" integer,
-- 	"parentTestPartId" integer,
-- 	"createdAt" timestamp with time zone,
-- 	"updatedAt" timestamp with time zone,
-- 	name varchar(126) NOT NULL,
-- 	description text,
	seconds integer
) INHERITS(public."testParts")
;
-- ddl-end --
ALTER TABLE public.delays OWNER TO postgres;
-- ddl-end --

-- object: public."testPartsInTest" | type: TABLE --
-- DROP TABLE IF EXISTS public."testPartsInTest" CASCADE;
CREATE TABLE public."testPartsInTest"(

);
-- ddl-end --

-- object: "testsId" | type: COLUMN --
-- ALTER TABLE public."testPartsInTest" DROP COLUMN IF EXISTS "testsId" CASCADE;
ALTER TABLE public."testPartsInTest" ADD COLUMN "testsId" integer;
-- ddl-end --


-- object: "testPartsId" | type: COLUMN --
-- ALTER TABLE public."testPartsInTest" DROP COLUMN IF EXISTS "testPartsId" CASCADE;
ALTER TABLE public."testPartsInTest" ADD COLUMN "testPartsId" integer;
-- ddl-end --


-- object: "position" | type: COLUMN --
-- ALTER TABLE public."testPartsInTest" DROP COLUMN IF EXISTS "position" CASCADE;
ALTER TABLE public."testPartsInTest" ADD COLUMN "position" integer NOT NULL;
-- ddl-end --

-- object: "testPartsInTest_pk" | type: CONSTRAINT --
-- ALTER TABLE public."testPartsInTest" DROP CONSTRAINT IF EXISTS "testPartsInTest_pk" CASCADE;
ALTER TABLE public."testPartsInTest" ADD CONSTRAINT "testPartsInTest_pk" PRIMARY KEY ("testsId","testPartsId");
-- ddl-end --

-- object: pos_larger_than_zero | type: CONSTRAINT --
-- ALTER TABLE public."testPartsInTest" DROP CONSTRAINT IF EXISTS pos_larger_than_zero CASCADE;
ALTER TABLE public."testPartsInTest" ADD CONSTRAINT pos_larger_than_zero CHECK (position > 0);
-- ddl-end --


-- object: tests_fk | type: CONSTRAINT --
-- ALTER TABLE public."testPartsInTest" DROP CONSTRAINT IF EXISTS tests_fk CASCADE;
ALTER TABLE public."testPartsInTest" ADD CONSTRAINT tests_fk FOREIGN KEY ("testsId")
REFERENCES public.tests (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "testParts_fk" | type: CONSTRAINT --
-- ALTER TABLE public."testPartsInTest" DROP CONSTRAINT IF EXISTS "testParts_fk" CASCADE;
ALTER TABLE public."testPartsInTest" ADD CONSTRAINT "testParts_fk" FOREIGN KEY ("testPartsId")
REFERENCES public."testParts" (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: public.tags | type: TABLE --
-- DROP TABLE IF EXISTS public.tags CASCADE;
CREATE TABLE public.tags(
	id serial NOT NULL,
	"projectsId" integer NOT NULL,
	tag varchar(64) NOT NULL,
	CONSTRAINT tags_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.tags OWNER TO postgres;
-- ddl-end --

-- object: public.headers | type: TABLE --
-- DROP TABLE IF EXISTS public.headers CASCADE;
CREATE TABLE public.headers(
	id serial NOT NULL,
	"projectsId" integer,
	"environmentsId" integer,
	"testsId" integer,
	"requestsId" integer,
	name varchar(256),
	value varchar(256),
	CONSTRAINT headers_pk PRIMARY KEY (id),
	CONSTRAINT at_least_one_not_null_resource CHECK ("projectsId" IS NOT NULL OR "environmentsId" IS NOT NULL OR "testsId" IS NOT NULL OR "requestsId" IS NOT NULL)

);
-- ddl-end --
ALTER TABLE public.headers OWNER TO postgres;
-- ddl-end --

-- object: public.variables | type: TABLE --
-- DROP TABLE IF EXISTS public.variables CASCADE;
CREATE TABLE public.variables(
	id serial NOT NULL,
	"usersId" integer NOT NULL,
	"testsId" integer NOT NULL,
	"requestsId" integer NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	name varchar(64) NOT NULL,
	property varchar(128),
	"defaultValue" text,
	CONSTRAINT variables_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.variables OWNER TO postgres;
-- ddl-end --

-- object: public."requestsHaveTags" | type: TABLE --
-- DROP TABLE IF EXISTS public."requestsHaveTags" CASCADE;
CREATE TABLE public."requestsHaveTags"(
	id_tags integer,
	id_requests integer,
	CONSTRAINT "requestsHaveTags_pk" PRIMARY KEY (id_tags,id_requests)

);
-- ddl-end --

-- object: tags_fk | type: CONSTRAINT --
-- ALTER TABLE public."requestsHaveTags" DROP CONSTRAINT IF EXISTS tags_fk CASCADE;
ALTER TABLE public."requestsHaveTags" ADD CONSTRAINT tags_fk FOREIGN KEY (id_tags)
REFERENCES public.tags (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: requests_fk | type: CONSTRAINT --
-- ALTER TABLE public."requestsHaveTags" DROP CONSTRAINT IF EXISTS requests_fk CASCADE;
ALTER TABLE public."requestsHaveTags" ADD CONSTRAINT requests_fk FOREIGN KEY (id_requests)
REFERENCES public.requests (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: public."userBelongsToEnvironment" | type: TABLE --
-- DROP TABLE IF EXISTS public."userBelongsToEnvironment" CASCADE;
CREATE TABLE public."userBelongsToEnvironment"(
	"usersId" integer,
	"enviromentsId" integer,
	user_role public.users_roles NOT NULL,
	CONSTRAINT "userBelongsToEnvironment_pk" PRIMARY KEY ("usersId","enviromentsId")

);
-- ddl-end --

-- object: users_fk | type: CONSTRAINT --
-- ALTER TABLE public."userBelongsToEnvironment" DROP CONSTRAINT IF EXISTS users_fk CASCADE;
ALTER TABLE public."userBelongsToEnvironment" ADD CONSTRAINT users_fk FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: enviroments_fk | type: CONSTRAINT --
-- ALTER TABLE public."userBelongsToEnvironment" DROP CONSTRAINT IF EXISTS enviroments_fk CASCADE;
ALTER TABLE public."userBelongsToEnvironment" ADD CONSTRAINT enviroments_fk FOREIGN KEY ("enviromentsId")
REFERENCES public.enviroments (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: public.notifications | type: TABLE --
-- DROP TABLE IF EXISTS public.notifications CASCADE;
CREATE TABLE public.notifications(
	id serial NOT NULL,
	"usersId" integer,
	"createdAt" timestamp with time zone,
	type text NOT NULL,
	content text,
	"actionLink" text,
	CONSTRAINT notification_pl PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.notifications OWNER TO postgres;
-- ddl-end --

-- object: public."httpParameters" | type: TABLE --
-- DROP TABLE IF EXISTS public."httpParameters" CASCADE;
CREATE TABLE public."httpParameters"(
	id serial NOT NULL,
	"requestsId" integer NOT NULL,
	name text NOT NULL,
	value text,
	CONSTRAINT "httpParameterPK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public."httpParameters" OWNER TO postgres;
-- ddl-end --

-- object: public."queryStringParameters" | type: TABLE --
-- DROP TABLE IF EXISTS public."queryStringParameters" CASCADE;
CREATE TABLE public."queryStringParameters"(
	id serial NOT NULL,
	"requestId" integer NOT NULL,
	name text NOT NULL,
	value text,
	CONSTRAINT "queryStringParameterPK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public."queryStringParameters" OWNER TO postgres;
-- ddl-end --

-- object: public."requestValidatedByAssertions" | type: TABLE --
-- DROP TABLE IF EXISTS public."requestValidatedByAssertions" CASCADE;
CREATE TABLE public."requestValidatedByAssertions"(
	id serial NOT NULL,
	"requestsId" integer NOT NULL,
	"assertionsId" integer NOT NULL,
	property text,
	"expectedValue" text,
	CONSTRAINT "requestValidatedByAssertionsPK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public."requestValidatedByAssertions" OWNER TO postgres;
-- ddl-end --

-- object: project_author | type: CONSTRAINT --
-- ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS project_author CASCADE;
ALTER TABLE public.projects ADD CONSTRAINT project_author FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: environment_in_project | type: CONSTRAINT --
-- ALTER TABLE public.enviroments DROP CONSTRAINT IF EXISTS environment_in_project CASCADE;
ALTER TABLE public.enviroments ADD CONSTRAINT environment_in_project FOREIGN KEY ("projectsId")
REFERENCES public.projects (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: environment | type: CONSTRAINT --
-- ALTER TABLE public.tests DROP CONSTRAINT IF EXISTS environment CASCADE;
ALTER TABLE public.tests ADD CONSTRAINT environment FOREIGN KEY ("environmentsId")
REFERENCES public.enviroments (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: test_author | type: CONSTRAINT --
-- ALTER TABLE public.tests DROP CONSTRAINT IF EXISTS test_author CASCADE;
ALTER TABLE public.tests ADD CONSTRAINT test_author FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: test_part_author | type: CONSTRAINT --
-- ALTER TABLE public."testParts" DROP CONSTRAINT IF EXISTS test_part_author CASCADE;
ALTER TABLE public."testParts" ADD CONSTRAINT test_part_author FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: parent_part | type: CONSTRAINT --
-- ALTER TABLE public."testParts" DROP CONSTRAINT IF EXISTS parent_part CASCADE;
ALTER TABLE public."testParts" ADD CONSTRAINT parent_part FOREIGN KEY ("parentTestPartId")
REFERENCES public."testParts" (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: version_author | type: CONSTRAINT --
-- ALTER TABLE public.versions DROP CONSTRAINT IF EXISTS version_author CASCADE;
ALTER TABLE public.versions ADD CONSTRAINT version_author FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: belonging_to_response | type: CONSTRAINT --
-- ALTER TABLE public."responseHeaders" DROP CONSTRAINT IF EXISTS belonging_to_response CASCADE;
ALTER TABLE public."responseHeaders" ADD CONSTRAINT belonging_to_response FOREIGN KEY ("responsesId")
REFERENCES public.response (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: source_response | type: CONSTRAINT --
-- ALTER TABLE public."evaluatedAsserions" DROP CONSTRAINT IF EXISTS source_response CASCADE;
ALTER TABLE public."evaluatedAsserions" ADD CONSTRAINT source_response FOREIGN KEY ("responsesId")
REFERENCES public.response (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: evaluated_request | type: CONSTRAINT --
-- ALTER TABLE public."evaluatedAsserions" DROP CONSTRAINT IF EXISTS evaluated_request CASCADE;
ALTER TABLE public."evaluatedAsserions" ADD CONSTRAINT evaluated_request FOREIGN KEY ("requestsId")
REFERENCES public.requests (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: belonging_to_response | type: CONSTRAINT --
-- ALTER TABLE public."requestHeaders" DROP CONSTRAINT IF EXISTS belonging_to_response CASCADE;
ALTER TABLE public."requestHeaders" ADD CONSTRAINT belonging_to_response FOREIGN KEY ("responsesId")
REFERENCES public.response (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: version | type: CONSTRAINT --
-- ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS version CASCADE;
ALTER TABLE public.requests ADD CONSTRAINT version FOREIGN KEY ("versionsId")
REFERENCES public.versions (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: belongs_to_request | type: CONSTRAINT --
-- ALTER TABLE public.response DROP CONSTRAINT IF EXISTS belongs_to_request CASCADE;
ALTER TABLE public.response ADD CONSTRAINT belongs_to_request FOREIGN KEY ("requestsId")
REFERENCES public.requests (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: tags_in_project | type: CONSTRAINT --
-- ALTER TABLE public.tags DROP CONSTRAINT IF EXISTS tags_in_project CASCADE;
ALTER TABLE public.tags ADD CONSTRAINT tags_in_project FOREIGN KEY ("projectsId")
REFERENCES public.projects (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: header_in_project | type: CONSTRAINT --
-- ALTER TABLE public.headers DROP CONSTRAINT IF EXISTS header_in_project CASCADE;
ALTER TABLE public.headers ADD CONSTRAINT header_in_project FOREIGN KEY ("projectsId")
REFERENCES public.projects (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: header_in_environment | type: CONSTRAINT --
-- ALTER TABLE public.headers DROP CONSTRAINT IF EXISTS header_in_environment CASCADE;
ALTER TABLE public.headers ADD CONSTRAINT header_in_environment FOREIGN KEY ("environmentsId")
REFERENCES public.enviroments (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: header_in_test | type: CONSTRAINT --
-- ALTER TABLE public.headers DROP CONSTRAINT IF EXISTS header_in_test CASCADE;
ALTER TABLE public.headers ADD CONSTRAINT header_in_test FOREIGN KEY ("testsId")
REFERENCES public.tests (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: header_in_request | type: CONSTRAINT --
-- ALTER TABLE public.headers DROP CONSTRAINT IF EXISTS header_in_request CASCADE;
ALTER TABLE public.headers ADD CONSTRAINT header_in_request FOREIGN KEY ("requestsId")
REFERENCES public.requests (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: variable_defined_for_test | type: CONSTRAINT --
-- ALTER TABLE public.variables DROP CONSTRAINT IF EXISTS variable_defined_for_test CASCADE;
ALTER TABLE public.variables ADD CONSTRAINT variable_defined_for_test FOREIGN KEY ("testsId")
REFERENCES public.tests (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: variable_author | type: CONSTRAINT --
-- ALTER TABLE public.variables DROP CONSTRAINT IF EXISTS variable_author CASCADE;
ALTER TABLE public.variables ADD CONSTRAINT variable_author FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: reciever_of_notification | type: CONSTRAINT --
-- ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS reciever_of_notification CASCADE;
ALTER TABLE public.notifications ADD CONSTRAINT reciever_of_notification FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: parameter_belongs_to_request | type: CONSTRAINT --
-- ALTER TABLE public."httpParameters" DROP CONSTRAINT IF EXISTS parameter_belongs_to_request CASCADE;
ALTER TABLE public."httpParameters" ADD CONSTRAINT parameter_belongs_to_request FOREIGN KEY ("requestsId")
REFERENCES public.requests (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: parameter_belongs_to_request | type: CONSTRAINT --
-- ALTER TABLE public."queryStringParameters" DROP CONSTRAINT IF EXISTS parameter_belongs_to_request CASCADE;
ALTER TABLE public."queryStringParameters" ADD CONSTRAINT parameter_belongs_to_request FOREIGN KEY ("requestId")
REFERENCES public.requests (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: validated_request_fk | type: CONSTRAINT --
-- ALTER TABLE public."requestValidatedByAssertions" DROP CONSTRAINT IF EXISTS validated_request_fk CASCADE;
ALTER TABLE public."requestValidatedByAssertions" ADD CONSTRAINT validated_request_fk FOREIGN KEY ("requestsId")
REFERENCES public.requests (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: validating_assertion_fk | type: CONSTRAINT --
-- ALTER TABLE public."requestValidatedByAssertions" DROP CONSTRAINT IF EXISTS validating_assertion_fk CASCADE;
ALTER TABLE public."requestValidatedByAssertions" ADD CONSTRAINT validating_assertion_fk FOREIGN KEY ("assertionsId")
REFERENCES public.assertions (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --



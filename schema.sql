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
-- 	ENCODING = 'UTF8'
-- 	LC_COLLATE = 'cs_CZ.UTF8'
-- 	LC_CTYPE = 'cs_CZ.UTF8'
-- 	TABLESPACE = pg_default
-- 	OWNER = postgres
-- ;
-- -- ddl-end --
-- 

-- object: public.languages | type: TYPE --
-- DROP TYPE IF EXISTS public.languages CASCADE;
CREATE TYPE public.languages AS
 ENUM ('cs','en');
-- ddl-end --
ALTER TYPE public.languages OWNER TO postgres;
-- ddl-end --

-- object: public.projects_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.projects_id_seq CASCADE;
CREATE SEQUENCE public.projects_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.projects | type: TABLE --
-- DROP TABLE IF EXISTS public.projects CASCADE;
CREATE TABLE public.projects(
	id integer NOT NULL DEFAULT nextval('public.projects_id_seq'::regclass),
	"usersId" integer NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	name character varying(256) NOT NULL,
	description text,
	CONSTRAINT id PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.projects OWNER TO postgres;
-- ddl-end --

-- object: public.environments_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.environments_id_seq CASCADE;
CREATE SEQUENCE public.environments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public.environments_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.environments | type: TABLE --
-- DROP TABLE IF EXISTS public.environments CASCADE;
CREATE TABLE public.environments(
	id integer NOT NULL DEFAULT nextval('public.environments_id_seq'::regclass),
	"projectsId" integer NOT NULL,
	"usersId" integer NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	"apiEndpoint" text NOT NULL,
	name character varying(256) NOT NULL,
	description text,
	CONSTRAINT primary_key_4 PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.environments OWNER TO postgres;
-- ddl-end --

-- object: public.response_status | type: TYPE --
-- DROP TYPE IF EXISTS public.response_status CASCADE;
CREATE TYPE public.response_status AS
 ENUM ('waiting_for_response','evaluating','failed','success');
-- ddl-end --
ALTER TYPE public.response_status OWNER TO postgres;
-- ddl-end --

-- object: public.versions_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.versions_id_seq CASCADE;
CREATE SEQUENCE public.versions_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public.versions_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.versions | type: TABLE --
-- DROP TABLE IF EXISTS public.versions CASCADE;
CREATE TABLE public.versions(
	id integer NOT NULL DEFAULT nextval('public.versions_id_seq'::regclass),
	"usersId" integer NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	name character varying(126) NOT NULL,
	description text,
	"urlSegment" character varying(64),
	"projectsId" integer NOT NULL,
	CONSTRAINT primary_key_1 PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.versions OWNER TO postgres;
-- ddl-end --

-- object: public.assertion_comparator | type: TYPE --
-- DROP TYPE IF EXISTS public.assertion_comparator CASCADE;
CREATE TYPE public.assertion_comparator AS
 ENUM ('eq','lt','gt','le','ge','ne','in','not_in');
-- ddl-end --
ALTER TYPE public.assertion_comparator OWNER TO postgres;
-- ddl-end --

-- object: public."evaluatedAsserions_id_seq" | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public."evaluatedAsserions_id_seq" CASCADE;
CREATE SEQUENCE public."evaluatedAsserions_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public."evaluatedAsserions_id_seq" OWNER TO postgres;
-- ddl-end --

-- object: public."evaluatedAssertions" | type: TABLE --
-- DROP TABLE IF EXISTS public."evaluatedAssertions" CASCADE;
CREATE TABLE public."evaluatedAssertions"(
	id integer NOT NULL DEFAULT nextval('public."evaluatedAsserions_id_seq"'::regclass),
	"responsesId" integer NOT NULL,
	"createdAt" timestamp with time zone,
	"assertionType" character varying(64) NOT NULL,
	"assertionName" character varying(126) NOT NULL,
	"assertionProperty" text,
	"assertionExpectedValue" text,
	"recievedValue" text,
	passed boolean NOT NULL,
	"assertionComparator" public.assertion_comparator NOT NULL,
	CONSTRAINT evaluated_assertions_primary_key PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public."evaluatedAssertions" OWNER TO postgres;
-- ddl-end --

-- object: public.assertions | type: TABLE --
-- DROP TABLE IF EXISTS public.assertions CASCADE;
CREATE TABLE public.assertions(
	type character varying(64) NOT NULL,
	name character varying(126) NOT NULL,
	description text,
	CONSTRAINT assertions_type PRIMARY KEY (type)

);
-- ddl-end --
ALTER TABLE public.assertions OWNER TO postgres;
-- ddl-end --

-- object: public.requests_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.requests_id_seq CASCADE;
CREATE SEQUENCE public.requests_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public.requests_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.requests | type: TABLE --
-- DROP TABLE IF EXISTS public.requests CASCADE;
CREATE TABLE public.requests(
	id integer NOT NULL DEFAULT nextval('public.requests_id_seq'::regclass),
	"usersId" integer,
	"environmentsId" integer NOT NULL,
	"versionsId" integer,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	name character varying(128) NOT NULL,
	url text NOT NULL,
	"httpMethod" character varying(128) NOT NULL,
	"resourceName" character varying(256),
	"methodName" character varying(256),
	description text,
	"lastRunStatus" public.response_status,
	"authenticationsId" integer,
	envelope character varying(64),
	CONSTRAINT requests_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.requests OWNER TO postgres;
-- ddl-end --

-- object: public.tests_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.tests_id_seq CASCADE;
CREATE SEQUENCE public.tests_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public.tests_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.tests | type: TABLE --
-- DROP TABLE IF EXISTS public.tests CASCADE;
CREATE TABLE public.tests(
	id integer NOT NULL DEFAULT nextval('public.tests_id_seq'::regclass),
	"environmentsId" integer NOT NULL,
	"usersId" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone,
	name character varying(128) NOT NULL,
	description text,
	"nextRun" timestamp with time zone,
	"lastRun" timestamp with time zone,
	"lastRunStatus" public.response_status,
	"runInterval" integer,
	CONSTRAINT primary_key_3 PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.tests OWNER TO postgres;
-- ddl-end --

-- object: public.users_roles | type: TYPE --
-- DROP TYPE IF EXISTS public.users_roles CASCADE;
CREATE TYPE public.users_roles AS
 ENUM ('host','manager','tester');
-- ddl-end --
ALTER TYPE public.users_roles OWNER TO postgres;
-- ddl-end --

-- object: public.responses_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.responses_id_seq CASCADE;
CREATE SEQUENCE public.responses_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public.responses_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.responses | type: TABLE --
-- DROP TABLE IF EXISTS public.responses CASCADE;
CREATE TABLE public.responses(
	id integer NOT NULL DEFAULT nextval('public.responses_id_seq'::regclass),
	"requestsId" integer NOT NULL,
	"runnedTestsId" integer,
	"createdAt" timestamp with time zone,
	"requestUrl" text NOT NULL,
	"requestHttpParameters" json,
	"responseTime" integer,
	"responseCode" smallint,
	"responseSize" integer,
	"responseBodyRaw" text,
	"passedAssertions" boolean,
	status public.response_status NOT NULL,
	"environmentsId" integer NOT NULL,
	"requestHeaders" json,
	"responseHeaders" json,
	"testsId" integer NOT NULL,
	"requestMethod" character varying(64) NOT NULL,
	"requestName" text NOT NULL,
	CONSTRAINT response_primary_key PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.responses OWNER TO postgres;
-- ddl-end --

-- object: public.comparision_operator | type: TYPE --
-- DROP TYPE IF EXISTS public.comparision_operator CASCADE;
CREATE TYPE public.comparision_operator AS
 ENUM ('=','!=','<','<=','>','=>');
-- ddl-end --
ALTER TYPE public.comparision_operator OWNER TO postgres;
-- ddl-end --

-- object: public.headers_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.headers_id_seq CASCADE;
CREATE SEQUENCE public.headers_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public.headers_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.headers | type: TABLE --
-- DROP TABLE IF EXISTS public.headers CASCADE;
CREATE TABLE public.headers(
	id integer NOT NULL DEFAULT nextval('public.headers_id_seq'::regclass),
	"projectsId" integer,
	"environmentsId" integer,
	"testsId" integer,
	"requestsId" integer,
	name character varying(256),
	value character varying(256),
	CONSTRAINT headers_pk PRIMARY KEY (id),
	CONSTRAINT at_least_one_not_null_resource CHECK ((("projectsId" IS NOT NULL) OR ("environmentsId" IS NOT NULL) OR ("testsId" IS NOT NULL) OR ("requestsId" IS NOT NULL)))

);
-- ddl-end --
ALTER TABLE public.headers OWNER TO postgres;
-- ddl-end --

-- object: public.users_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.users_id_seq CASCADE;
CREATE SEQUENCE public.users_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public.users_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.users | type: TABLE --
-- DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users(
	id integer NOT NULL DEFAULT nextval('public.users_id_seq'::regclass),
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	language public.languages,
	name character varying(128) NOT NULL,
	email character varying(256) NOT NULL,
	password character varying(256) NOT NULL,
	CONSTRAINT primary_key PRIMARY KEY (id),
	CONSTRAINT unique_email UNIQUE (email)

);
-- ddl-end --
ALTER TABLE public.users OWNER TO postgres;
-- ddl-end --

-- object: public."httpParameters_id_seq" | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public."httpParameters_id_seq" CASCADE;
CREATE SEQUENCE public."httpParameters_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public."httpParameters_id_seq" OWNER TO postgres;
-- ddl-end --

-- object: public."httpParameters" | type: TABLE --
-- DROP TABLE IF EXISTS public."httpParameters" CASCADE;
CREATE TABLE public."httpParameters"(
	id integer NOT NULL DEFAULT nextval('public."httpParameters_id_seq"'::regclass),
	"requestsId" integer NOT NULL,
	name text NOT NULL,
	value text,
	CONSTRAINT "httpParameterPK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public."httpParameters" OWNER TO postgres;
-- ddl-end --

-- object: public."requestsInTest" | type: TABLE --
-- DROP TABLE IF EXISTS public."requestsInTest" CASCADE;
CREATE TABLE public."requestsInTest"(
	"requestsId" integer NOT NULL,
	"testsId" integer NOT NULL,
	"position" integer DEFAULT 1,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "requestsInTest_pk" PRIMARY KEY ("requestsId","testsId")

);
-- ddl-end --
ALTER TABLE public."requestsInTest" OWNER TO postgres;
-- ddl-end --

-- object: public."runnedTests_id_seq" | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public."runnedTests_id_seq" CASCADE;
CREATE SEQUENCE public."runnedTests_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public."runnedTests_id_seq" OWNER TO postgres;
-- ddl-end --

-- object: public."runnedTests" | type: TABLE --
-- DROP TABLE IF EXISTS public."runnedTests" CASCADE;
CREATE TABLE public."runnedTests"(
	id integer NOT NULL DEFAULT nextval('public."runnedTests_id_seq"'::regclass),
	"testsId" integer,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	status public.response_status,
	"testName" character varying(128),
	"testDescription" text,
	"environmentsId" integer,
	CONSTRAINT runned_tests_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public."runnedTests" OWNER TO postgres;
-- ddl-end --

-- object: public."documentationPages_id_seq" | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public."documentationPages_id_seq" CASCADE;
CREATE SEQUENCE public."documentationPages_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public."documentationPages_id_seq" OWNER TO postgres;
-- ddl-end --

-- object: public."documentationPages" | type: TABLE --
-- DROP TABLE IF EXISTS public."documentationPages" CASCADE;
CREATE TABLE public."documentationPages"(
	id integer NOT NULL DEFAULT nextval('public."documentationPages_id_seq"'::regclass),
	language public.languages,
	title character varying,
	content text
);
-- ddl-end --
ALTER TABLE public."documentationPages" OWNER TO postgres;
-- ddl-end --

-- object: public."userBelongsToEnvironments" | type: TABLE --
-- DROP TABLE IF EXISTS public."userBelongsToEnvironments" CASCADE;
CREATE TABLE public."userBelongsToEnvironments"(
	"usersId" integer NOT NULL,
	"environmentsId" integer NOT NULL,
	"userRole" public.users_roles NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "userBelongsToEnvironments_pk" PRIMARY KEY ("usersId","environmentsId")

);
-- ddl-end --
ALTER TABLE public."userBelongsToEnvironments" OWNER TO postgres;
-- ddl-end --

-- object: email | type: INDEX --
-- DROP INDEX IF EXISTS public.email CASCADE;
CREATE INDEX email ON public.users
	USING btree
	(
	  email
	)	WITH (FILLFACTOR = 90);
-- ddl-end --

-- object: next_test_run | type: INDEX --
-- DROP INDEX IF EXISTS public.next_test_run CASCADE;
CREATE INDEX next_test_run ON public.tests
	USING btree
	(
	  "nextRun"
	)	WITH (FILLFACTOR = 90);
-- ddl-end --

-- object: is_test_active | type: INDEX --
-- DROP INDEX IF EXISTS public.is_test_active CASCADE;
CREATE INDEX is_test_active ON public.tests
	USING btree
	(
	  "lastRunStatus"
	)	WITH (FILLFACTOR = 90);
-- ddl-end --

-- object: public."requestValidatedByAssertions_id_seq" | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public."requestValidatedByAssertions_id_seq" CASCADE;
CREATE SEQUENCE public."requestValidatedByAssertions_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public."requestValidatedByAssertions_id_seq" OWNER TO postgres;
-- ddl-end --

-- object: public."requestValidatedByAssertions" | type: TABLE --
-- DROP TABLE IF EXISTS public."requestValidatedByAssertions" CASCADE;
CREATE TABLE public."requestValidatedByAssertions"(
	id integer NOT NULL DEFAULT nextval('public."requestValidatedByAssertions_id_seq"'::regclass),
	"requestsId" integer NOT NULL,
	"assertionType" character varying(64) NOT NULL,
	property text,
	"expectedValue" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	comparator public.assertion_comparator NOT NULL,
	CONSTRAINT "requestValidatedByAssertionsPK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public."requestValidatedByAssertions" OWNER TO postgres;
-- ddl-end --

-- object: "requestValidatedByAssertions_assertionType" | type: INDEX --
-- DROP INDEX IF EXISTS public."requestValidatedByAssertions_assertionType" CASCADE;
CREATE INDEX "requestValidatedByAssertions_assertionType" ON public."requestValidatedByAssertions"
	USING btree
	(
	  "assertionType"
	)	WITH (FILLFACTOR = 90);
-- ddl-end --

-- object: public.authentication_types | type: TYPE --
-- DROP TYPE IF EXISTS public.authentication_types CASCADE;
CREATE TYPE public.authentication_types AS
 ENUM ('base','bearer');
-- ddl-end --
ALTER TYPE public.authentication_types OWNER TO postgres;
-- ddl-end --

-- object: public.authentications_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.authentications_id_seq CASCADE;
CREATE SEQUENCE public.authentications_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public.authentications_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.authentications | type: TABLE --
-- DROP TABLE IF EXISTS public.authentications CASCADE;
CREATE TABLE public.authentications(
	id integer NOT NULL DEFAULT nextval('public.authentications_id_seq'::regclass),
	"environmentsId" integer NOT NULL,
	"usersId" integer NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	type public.authentication_types NOT NULL,
	username text,
	password text,
	name text NOT NULL,
	token text,
	"tokenParameter" character varying(64),
	CONSTRAINT authentications_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.authentications OWNER TO postgres;
-- ddl-end --

-- object: public.variables_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.variables_id_seq CASCADE;
CREATE SEQUENCE public.variables_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;
-- ddl-end --
ALTER SEQUENCE public.variables_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.variables | type: TABLE --
-- DROP TABLE IF EXISTS public.variables CASCADE;
CREATE TABLE public.variables(
	id integer NOT NULL DEFAULT nextval('public.variables_id_seq'::regclass),
	"usersId" integer NOT NULL,
	"testsId" integer NOT NULL,
	"requestsId" integer NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	name character varying(64) NOT NULL,
	property character varying(128),
	"defaultValue" text,
	CONSTRAINT variables_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.variables OWNER TO postgres;
-- ddl-end --

-- object: "requestValidatedByAssertions_requestsId" | type: INDEX --
-- DROP INDEX IF EXISTS public."requestValidatedByAssertions_requestsId" CASCADE;
CREATE INDEX "requestValidatedByAssertions_requestsId" ON public."requestValidatedByAssertions"
	USING btree
	(
	  "requestsId"
	)	WITH (FILLFACTOR = 90);
-- ddl-end --

-- object: project_author | type: CONSTRAINT --
-- ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS project_author CASCADE;
ALTER TABLE public.projects ADD CONSTRAINT project_author FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: environment_in_project | type: CONSTRAINT --
-- ALTER TABLE public.environments DROP CONSTRAINT IF EXISTS environment_in_project CASCADE;
ALTER TABLE public.environments ADD CONSTRAINT environment_in_project FOREIGN KEY ("projectsId")
REFERENCES public.projects (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: environment_author | type: CONSTRAINT --
-- ALTER TABLE public.environments DROP CONSTRAINT IF EXISTS environment_author CASCADE;
ALTER TABLE public.environments ADD CONSTRAINT environment_author FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: "versions_projectsId_fkey" | type: CONSTRAINT --
-- ALTER TABLE public.versions DROP CONSTRAINT IF EXISTS "versions_projectsId_fkey" CASCADE;
ALTER TABLE public.versions ADD CONSTRAINT "versions_projectsId_fkey" FOREIGN KEY ("projectsId")
REFERENCES public.projects (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: "versions_usersId_fkey" | type: CONSTRAINT --
-- ALTER TABLE public.versions DROP CONSTRAINT IF EXISTS "versions_usersId_fkey" CASCADE;
ALTER TABLE public.versions ADD CONSTRAINT "versions_usersId_fkey" FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: version_author | type: CONSTRAINT --
-- ALTER TABLE public.versions DROP CONSTRAINT IF EXISTS version_author CASCADE;
ALTER TABLE public.versions ADD CONSTRAINT version_author FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: version_in_project_fk | type: CONSTRAINT --
-- ALTER TABLE public.versions DROP CONSTRAINT IF EXISTS version_in_project_fk CASCADE;
ALTER TABLE public.versions ADD CONSTRAINT version_in_project_fk FOREIGN KEY ("projectsId")
REFERENCES public.projects (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: "evaluatedAssertions_responsesId_fkey" | type: CONSTRAINT --
-- ALTER TABLE public."evaluatedAssertions" DROP CONSTRAINT IF EXISTS "evaluatedAssertions_responsesId_fkey" CASCADE;
ALTER TABLE public."evaluatedAssertions" ADD CONSTRAINT "evaluatedAssertions_responsesId_fkey" FOREIGN KEY ("responsesId")
REFERENCES public.responses (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: version | type: CONSTRAINT --
-- ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS version CASCADE;
ALTER TABLE public.requests ADD CONSTRAINT version FOREIGN KEY ("versionsId")
REFERENCES public.versions (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: request_author | type: CONSTRAINT --
-- ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS request_author CASCADE;
ALTER TABLE public.requests ADD CONSTRAINT request_author FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: request_in_environment | type: CONSTRAINT --
-- ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS request_in_environment CASCADE;
ALTER TABLE public.requests ADD CONSTRAINT request_in_environment FOREIGN KEY ("environmentsId")
REFERENCES public.environments (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: "requests_authenticationsId_fkey" | type: CONSTRAINT --
-- ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS "requests_authenticationsId_fkey" CASCADE;
ALTER TABLE public.requests ADD CONSTRAINT "requests_authenticationsId_fkey" FOREIGN KEY ("authenticationsId")
REFERENCES public.authentications (id) MATCH SIMPLE
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: authentication_request_fk | type: CONSTRAINT --
-- ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS authentication_request_fk CASCADE;
ALTER TABLE public.requests ADD CONSTRAINT authentication_request_fk FOREIGN KEY ("authenticationsId")
REFERENCES public.authentications (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: environment | type: CONSTRAINT --
-- ALTER TABLE public.tests DROP CONSTRAINT IF EXISTS environment CASCADE;
ALTER TABLE public.tests ADD CONSTRAINT environment FOREIGN KEY ("environmentsId")
REFERENCES public.environments (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: test_author | type: CONSTRAINT --
-- ALTER TABLE public.tests DROP CONSTRAINT IF EXISTS test_author CASCADE;
ALTER TABLE public.tests ADD CONSTRAINT test_author FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: belongs_to_request | type: CONSTRAINT --
-- ALTER TABLE public.responses DROP CONSTRAINT IF EXISTS belongs_to_request CASCADE;
ALTER TABLE public.responses ADD CONSTRAINT belongs_to_request FOREIGN KEY ("requestsId")
REFERENCES public.requests (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: test_result_id | type: CONSTRAINT --
-- ALTER TABLE public.responses DROP CONSTRAINT IF EXISTS test_result_id CASCADE;
ALTER TABLE public.responses ADD CONSTRAINT test_result_id FOREIGN KEY ("runnedTestsId")
REFERENCES public."runnedTests" (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: "responses_environmentsId_fkey" | type: CONSTRAINT --
-- ALTER TABLE public.responses DROP CONSTRAINT IF EXISTS "responses_environmentsId_fkey" CASCADE;
ALTER TABLE public.responses ADD CONSTRAINT "responses_environmentsId_fkey" FOREIGN KEY ("environmentsId")
REFERENCES public.environments (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: "responses_testsId_fkey" | type: CONSTRAINT --
-- ALTER TABLE public.responses DROP CONSTRAINT IF EXISTS "responses_testsId_fkey" CASCADE;
ALTER TABLE public.responses ADD CONSTRAINT "responses_testsId_fkey" FOREIGN KEY ("testsId")
REFERENCES public.tests (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: response_environment_fk | type: CONSTRAINT --
-- ALTER TABLE public.responses DROP CONSTRAINT IF EXISTS response_environment_fk CASCADE;
ALTER TABLE public.responses ADD CONSTRAINT response_environment_fk FOREIGN KEY ("environmentsId")
REFERENCES public.environments (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: response_in_test_fk | type: CONSTRAINT --
-- ALTER TABLE public.responses DROP CONSTRAINT IF EXISTS response_in_test_fk CASCADE;
ALTER TABLE public.responses ADD CONSTRAINT response_in_test_fk FOREIGN KEY ("testsId")
REFERENCES public.tests (id) MATCH FULL
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
REFERENCES public.environments (id) MATCH FULL
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

-- object: parameter_belongs_to_request | type: CONSTRAINT --
-- ALTER TABLE public."httpParameters" DROP CONSTRAINT IF EXISTS parameter_belongs_to_request CASCADE;
ALTER TABLE public."httpParameters" ADD CONSTRAINT parameter_belongs_to_request FOREIGN KEY ("requestsId")
REFERENCES public.requests (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: "requestsInTest_requestsId_fkey" | type: CONSTRAINT --
-- ALTER TABLE public."requestsInTest" DROP CONSTRAINT IF EXISTS "requestsInTest_requestsId_fkey" CASCADE;
ALTER TABLE public."requestsInTest" ADD CONSTRAINT "requestsInTest_requestsId_fkey" FOREIGN KEY ("requestsId")
REFERENCES public.requests (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: "requestsInTest_testsId_fkey" | type: CONSTRAINT --
-- ALTER TABLE public."requestsInTest" DROP CONSTRAINT IF EXISTS "requestsInTest_testsId_fkey" CASCADE;
ALTER TABLE public."requestsInTest" ADD CONSTRAINT "requestsInTest_testsId_fkey" FOREIGN KEY ("testsId")
REFERENCES public.tests (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: requests_fk | type: CONSTRAINT --
-- ALTER TABLE public."requestsInTest" DROP CONSTRAINT IF EXISTS requests_fk CASCADE;
ALTER TABLE public."requestsInTest" ADD CONSTRAINT requests_fk FOREIGN KEY ("requestsId")
REFERENCES public.requests (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: tests_fk | type: CONSTRAINT --
-- ALTER TABLE public."requestsInTest" DROP CONSTRAINT IF EXISTS tests_fk CASCADE;
ALTER TABLE public."requestsInTest" ADD CONSTRAINT tests_fk FOREIGN KEY ("testsId")
REFERENCES public.tests (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: test_id_fk | type: CONSTRAINT --
-- ALTER TABLE public."runnedTests" DROP CONSTRAINT IF EXISTS test_id_fk CASCADE;
ALTER TABLE public."runnedTests" ADD CONSTRAINT test_id_fk FOREIGN KEY ("testsId")
REFERENCES public.tests (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: "runnedTests_environmentsId_fkey" | type: CONSTRAINT --
-- ALTER TABLE public."runnedTests" DROP CONSTRAINT IF EXISTS "runnedTests_environmentsId_fkey" CASCADE;
ALTER TABLE public."runnedTests" ADD CONSTRAINT "runnedTests_environmentsId_fkey" FOREIGN KEY ("environmentsId")
REFERENCES public.environments (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: users_fk | type: CONSTRAINT --
-- ALTER TABLE public."userBelongsToEnvironments" DROP CONSTRAINT IF EXISTS users_fk CASCADE;
ALTER TABLE public."userBelongsToEnvironments" ADD CONSTRAINT users_fk FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: environments_fk | type: CONSTRAINT --
-- ALTER TABLE public."userBelongsToEnvironments" DROP CONSTRAINT IF EXISTS environments_fk CASCADE;
ALTER TABLE public."userBelongsToEnvironments" ADD CONSTRAINT environments_fk FOREIGN KEY ("environmentsId")
REFERENCES public.environments (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: validated_request_fk | type: CONSTRAINT --
-- ALTER TABLE public."requestValidatedByAssertions" DROP CONSTRAINT IF EXISTS validated_request_fk CASCADE;
ALTER TABLE public."requestValidatedByAssertions" ADD CONSTRAINT validated_request_fk FOREIGN KEY ("requestsId")
REFERENCES public.requests (id) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: "requestValidatedByAssertions_assertionType_fkey" | type: CONSTRAINT --
-- ALTER TABLE public."requestValidatedByAssertions" DROP CONSTRAINT IF EXISTS "requestValidatedByAssertions_assertionType_fkey" CASCADE;
ALTER TABLE public."requestValidatedByAssertions" ADD CONSTRAINT "requestValidatedByAssertions_assertionType_fkey" FOREIGN KEY ("assertionType")
REFERENCES public.assertions (type) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: assertion_type_fk | type: CONSTRAINT --
-- ALTER TABLE public."requestValidatedByAssertions" DROP CONSTRAINT IF EXISTS assertion_type_fk CASCADE;
ALTER TABLE public."requestValidatedByAssertions" ADD CONSTRAINT assertion_type_fk FOREIGN KEY ("assertionType")
REFERENCES public.assertions (type) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: auth_in_environment_fk | type: CONSTRAINT --
-- ALTER TABLE public.authentications DROP CONSTRAINT IF EXISTS auth_in_environment_fk CASCADE;
ALTER TABLE public.authentications ADD CONSTRAINT auth_in_environment_fk FOREIGN KEY ("environmentsId")
REFERENCES public.environments (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: auth_author_fk | type: CONSTRAINT --
-- ALTER TABLE public.authentications DROP CONSTRAINT IF EXISTS auth_author_fk CASCADE;
ALTER TABLE public.authentications ADD CONSTRAINT auth_author_fk FOREIGN KEY ("usersId")
REFERENCES public.users (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
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



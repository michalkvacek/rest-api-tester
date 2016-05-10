--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.2
-- Dumped by pg_dump version 9.5.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

--
-- Data for Name: assertions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO assertions (type, name, description) VALUES ('property_exists', 'Vlastnost objektu existuje', NULL);
INSERT INTO assertions (type, name, description) VALUES ('count', 'Počet vlastností', NULL);
INSERT INTO assertions (type, name, description) VALUES ('json', 'Tělo odpovědi jako JSON', NULL);
INSERT INTO assertions (type, name, description) VALUES ('property_value', 'Hodnota vlastnosti', NULL);
INSERT INTO assertions (type, name, description) VALUES ('response_time', 'Čas odezvy', NULL);
INSERT INTO assertions (type, name, description) VALUES ('status_code', 'Stavový kód odpovědi', NULL);
INSERT INTO assertions (type, name, description) VALUES ('property_not_exist', 'Vlastnost objektu neexistuje', NULL);


--
-- PostgreSQL database dump complete
--


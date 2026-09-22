--
-- PostgreSQL database dump
--

\restrict YBc9QBgVyALgRw49QR4POOmhvZMNYIW1gqpbbHqaBsYyj3YB5TC7LekLCm1xIH9

-- Dumped from database version 16.15 (Debian 16.15-1.pgdg13+2)
-- Dumped by pg_dump version 16.15 (Debian 16.15-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: gifts; Type: TABLE; Schema: public; Owner: gifts_user
--

CREATE TABLE public.gifts (
    id bigint NOT NULL,
    name character varying(200) NOT NULL,
    brand character varying(150),
    price numeric(10,2) NOT NULL,
    url text NOT NULL,
    photo text,
    user_id bigint NOT NULL,
    reserved boolean DEFAULT false,
    CONSTRAINT gifts_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.gifts OWNER TO gifts_user;

--
-- Name: gifts_id_seq; Type: SEQUENCE; Schema: public; Owner: gifts_user
--

ALTER TABLE public.gifts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.gifts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: gifts_user
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(30) NOT NULL,
    surname character varying(30) NOT NULL,
    avatar text,
    password_hash character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO gifts_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: gifts_user
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: gifts; Type: TABLE DATA; Schema: public; Owner: gifts_user
--

COPY public.gifts (id, name, brand, price, url, photo, user_id, reserved) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: gifts_user
--

COPY public.users (id, name, surname, avatar, password_hash) FROM stdin;
5	Lucas	Sustain	https://i.pinimg.com/736x/fd/ed/65/fded6568a41ab6f1b9e9b42463e41687.jpg	$2a$06$J89jA74VsIeOe3woIedkwet8v8Ue29DESLmmzpCPswCmN.xfwf1Vy
6	Thea	Minus	https://i.pinimg.com/736x/ab/fd/f7/abfdf7a6f9c909cc29a7202b3b85d5f8.jpg	$2b$12$PYOTaBS0dXpz9/j7WFMdiOLKGhvdCpWujC.pFS1VZ9bf5WZxVd6Oa
7	Joan	Jojo	https://i.pinimg.com/736x/ff/12/89/ff128944c2d06206010d100f719e3d50.jpg	$2b$12$G4cOtXV946qsXr.9bXvDVuiwxjFbbCsD88.I7mkJDwuuWNAeq0fWa
8	Luigi	Gigi l'amoroso	https://i.pinimg.com/1200x/82/5b/0a/825b0aeaf53f61d0ad3770c85d336f87.jpg	$2b$12$98cMCmpW5rKZicfGIGqIg.gKDj5XYsIM7hpp9YtoqdOdHKNay6zJq
9	Laurie	Papillon	https://i.pinimg.com/736x/c1/d2/d2/c1d2d21bc63b0268b5276eed6f892b5b.jpg	$2b$12$/6jkXdeMACab./b7GZeKP.AoUHpG1XM/axLRoyZoHiK1KXTYpIKfK
10	Alexia	Fripouillasse	https://i.pinimg.com/736x/d1/30/77/d1307726079aa3c22191e6280e8d6ad5.jpg	$2b$12$7UKplURdE90A3xo0rz0X5uK7P2tdI1aqZSA6URbXQUcyjXeG/87EG
12	Sandrine	Cuisse	https://i.pinimg.com/736x/61/13/68/611368a492c2c54685e6f63023fc5082.jpg	$2b$12$VhjLEVBiU59zqx3Eg8FPwe1o2V7ABAqzc.Pceap.g7jX8tzIK6bWe
13	Jean-Vincent	Les Gens	https://i.pinimg.com/736x/c0/56/91/c05691212be8769c7d720bf1622cb950.jpg	$2b$12$R0oTCaCH3xph9ZlgjQPMcevznO11CpyYTfKGgJNP7eC9xNaxBroLa
11	Tony	Barbichou	https://i.pinimg.com/736x/74/cb/ed/74cbed7482ba60e3a149fcf54d4fa1ee.jpg	$2b$12$8Z5MjbIk94ikDH.CnyNsiurhGa14K.UxCVvSlfpeYao0FOIBIRz0G
\.


--
-- Name: gifts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gifts_user
--

SELECT pg_catalog.setval('public.gifts_id_seq', 12, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gifts_user
--

SELECT pg_catalog.setval('public.users_id_seq', 13, true);


--
-- Name: gifts gifts_pkey; Type: CONSTRAINT; Schema: public; Owner: gifts_user
--

ALTER TABLE ONLY public.gifts
    ADD CONSTRAINT gifts_pkey PRIMARY KEY (id);


--
-- Name: users users_name_surname_key; Type: CONSTRAINT; Schema: public; Owner: gifts_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_name_surname_key UNIQUE (name, surname);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: gifts_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: gifts fk_gifts_user; Type: FK CONSTRAINT; Schema: public; Owner: gifts_user
--

ALTER TABLE ONLY public.gifts
    ADD CONSTRAINT fk_gifts_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: gifts fk_user; Type: FK CONSTRAINT; Schema: public; Owner: gifts_user
--

ALTER TABLE ONLY public.gifts
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict YBc9QBgVyALgRw49QR4POOmhvZMNYIW1gqpbbHqaBsYyj3YB5TC7LekLCm1xIH9


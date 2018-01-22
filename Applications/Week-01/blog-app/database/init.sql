

CREATE TABLE blogs (
    id SERIAL NOT NULL,
    post character varying NOT NULL,
    sig character varying NOT NULL,
    created_at timestamp NOT NULL default now(),
    updated_at timestamp NOT NULL default now(),
    is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY blogs ADD CONSTRAINT blog_pkey PRIMARY KEY (id);
ALTER TABLE blogs OWNER TO postgres;
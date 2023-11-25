create table "public"."users" (
    "id" uuid not null,
    "name" character varying(255),
    "email" character varying(255),
    "referer_code" character varying(255),
    "ainnotations" integer default 50,
    "referred_by" uuid
);


alter table "public"."users" enable row level security;

CREATE INDEX idx_users_email ON public.users USING btree (email);

CREATE INDEX idx_users_refer_code ON public.users USING btree (referer_code);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_referer_code_key ON public.users USING btree (referer_code);

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_referer_code_key" UNIQUE using index "users_referer_code_key";

alter table "public"."users" add constraint "users_referred_by_fkey" FOREIGN KEY (referred_by) REFERENCES users(id) not valid;

alter table "public"."users" validate constraint "users_referred_by_fkey";
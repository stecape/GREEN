module.exports = function () {
  return new Promise((innerResolve, reject) => {
    const pg = require ('pg')
    const db_config = require('./db_config')
    const connStr = db_config.db_dialect + '://' + db_config.db_user + ':' + db_config.db_password + '@' + db_config.db_host + ':' + db_config.db_port + '/' + db_config.db_name
    var pool = new pg.Pool({connectionString: connStr})
    var queryString=`
    CREATE TABLE IF NOT EXISTS public."Field"
    (
      id SERIAL PRIMARY KEY,
      name text COLLATE pg_catalog."default" NOT NULL,
      type integer NOT NULL,
      parent_type integer NOT NULL,
      logic_values text COLLATE pg_catalog."default",
      um text COLLATE pg_catalog."default",
      CONSTRAINT unique_field_name UNIQUE (name)
    );
    
    CREATE TABLE IF NOT EXISTS public."TypeDependencies"
    (
      id SERIAL PRIMARY KEY,
      type integer NOT NULL,
      dependent_type integer NOT NULL
    );
  
    CREATE TABLE IF NOT EXISTS public."FieldPath"
    (
      id SERIAL PRIMARY KEY
    );
    
    CREATE TABLE IF NOT EXISTS public."FieldPathElement"
    (
      id SERIAL PRIMARY KEY,
      field_path integer NOT NULL,
      index integer NOT NULL,
      field integer NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS public."Tag"
    (
      var integer NOT NULL,
      field_path integer NOT NULL,
      value bytea NOT NULL,
      CONSTRAINT tag_id PRIMARY KEY (var, field_path)
    );
    
    CREATE TABLE IF NOT EXISTS public."Type"
    (
      id SERIAL PRIMARY KEY,
      name text NOT NULL,
      CONSTRAINT unique_type_name UNIQUE (name)
    );
    
    CREATE TABLE IF NOT EXISTS public."TypeFieldPath"
    (
      id SERIAL PRIMARY KEY,
      type integer NOT NULL,
      field_path integer NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS public."Var"
    (
      id SERIAL PRIMARY KEY,
      type integer NOT NULL,
      name text COLLATE pg_catalog."default" NOT NULL,
      CONSTRAINT unique_var_name UNIQUE (name)
    );
    
    CREATE TABLE IF NOT EXISTS public."NewTypeTmp"
    (
      id SERIAL PRIMARY KEY,
      type integer NOT NULL,
      name text COLLATE pg_catalog."default" NOT NULL,
      CONSTRAINT unique_new_field_name UNIQUE (name)
    );
    
    ALTER TABLE IF EXISTS public."Field"
      DROP CONSTRAINT IF EXISTS type_id,
      ADD CONSTRAINT type_id FOREIGN KEY (type)
      REFERENCES public."Type" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID,
      DROP CONSTRAINT IF EXISTS parent_type_id,
      ADD CONSTRAINT parent_type_id FOREIGN KEY (parent_type)
      REFERENCES public."Type" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
    

    ALTER TABLE IF EXISTS public."TypeDependencies"
      DROP CONSTRAINT IF EXISTS type_id,
      ADD CONSTRAINT type_id FOREIGN KEY (type)
      REFERENCES public."Type" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID,
      DROP CONSTRAINT IF EXISTS dependent_type_id,
      ADD CONSTRAINT dependent_type_id FOREIGN KEY (dependent_type)
      REFERENCES public."Type" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;

      
    ALTER TABLE IF EXISTS public."FieldPathElement"
      DROP CONSTRAINT IF EXISTS field_path_id,
      ADD CONSTRAINT field_path_id FOREIGN KEY (field_path)
      REFERENCES public."FieldPath" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
    CREATE INDEX IF NOT EXISTS fki_field_path_id
      ON public."FieldPathElement"(field_path);


    ALTER TABLE IF EXISTS public."FieldPathElement"
      DROP CONSTRAINT IF EXISTS field_id,
      ADD CONSTRAINT field_id FOREIGN KEY (field)
      REFERENCES public."Field" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
    CREATE INDEX IF NOT EXISTS fki_field_id
      ON public."FieldPathElement"(field);
    
    
    ALTER TABLE IF EXISTS public."Tag"
      DROP CONSTRAINT IF EXISTS field_path_id,
      ADD CONSTRAINT field_path_id FOREIGN KEY (field_path)
      REFERENCES public."FieldPath" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
    
    
    ALTER TABLE IF EXISTS public."Tag"
      DROP CONSTRAINT IF EXISTS var_id,
      ADD CONSTRAINT var_id FOREIGN KEY (var)
      REFERENCES public."Var" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
    CREATE INDEX IF NOT EXISTS fki_var_id
      ON public."Tag"(var);
    
    
    ALTER TABLE IF EXISTS public."TypeFieldPath"
      DROP CONSTRAINT IF EXISTS field_path_id,
      ADD CONSTRAINT field_path_id FOREIGN KEY (field_path)
      REFERENCES public."FieldPath" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
    
    
    ALTER TABLE IF EXISTS public."TypeFieldPath"
      DROP CONSTRAINT IF EXISTS type_id,
      ADD CONSTRAINT type_id FOREIGN KEY (type)
      REFERENCES public."Type" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
    
    
    ALTER TABLE IF EXISTS public."Var"
      DROP CONSTRAINT IF EXISTS type_id,
      ADD CONSTRAINT type_id FOREIGN KEY (type)
      REFERENCES public."Type" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
    CREATE INDEX IF NOT EXISTS fki_type_id
      ON public."Var"(type);
  
  
    ALTER TABLE IF EXISTS public."NewTypeTmp"
      DROP CONSTRAINT IF EXISTS type_id,
      ADD CONSTRAINT type_id FOREIGN KEY (type)
      REFERENCES public."Type" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
    CREATE INDEX IF NOT EXISTS fki_type_id
      ON public."NewTypeTmp"(type);

      
    INSERT INTO "Type"(id,name) VALUES (DEFAULT, 'Real') ON CONFLICT (name) DO NOTHING;
    INSERT INTO "Type"(id,name) VALUES (DEFAULT, 'Text') ON CONFLICT (name) DO NOTHING;
    INSERT INTO "Type"(id,name) VALUES (DEFAULT, 'Int') ON CONFLICT (name) DO NOTHING;
    INSERT INTO "Type"(id,name) VALUES (DEFAULT, 'Bool') ON CONFLICT (name) DO NOTHING;

    -- triggers function
    -- FUNCTION: public.return_data()
    CREATE OR REPLACE FUNCTION public.return_data()
        RETURNS trigger
        LANGUAGE 'plpgsql'
        COST 100
        VOLATILE
    AS $BODY$
    DECLARE
      obj text := '';
    BEGIN 
    RAISE NOTICE 'obj: %', OLD::text;
      IF (TG_OP = 'UPDATE') THEN
      obj = '{"operation":' || to_json(TG_OP)::text || ',"table":' || to_json(TG_TABLE_NAME)::text || ',"data":' || row_to_json(NEW)::text || '}';
        PERFORM pg_notify('changes', obj);
        ELSIF (TG_OP = 'INSERT') THEN
      obj = '{"operation":' || to_json(TG_OP)::text || ',"table":' || to_json(TG_TABLE_NAME)::text || ',"data":' || row_to_json(NEW)::text || '}';
        PERFORM pg_notify('changes', obj);
        ELSIF (TG_OP = 'DELETE') THEN 
      obj = '{"operation":' || to_json(TG_OP)::text || ',"table":' || to_json(TG_TABLE_NAME)::text || ',"data":' || row_to_json(OLD)::text || '}';
        PERFORM pg_notify('changes', obj);
        ELSIF (TG_OP = 'TRUNCATE') THEN 
      obj = '{"operation":' || to_json(TG_OP)::text || ',"table":' || to_json(TG_TABLE_NAME)::text || '}';
        PERFORM pg_notify('changes', obj);
      END IF;
      RETURN NULL;
    END;
    $BODY$;

    -- triggers on Tag
    CREATE OR REPLACE TRIGGER \"TagInsertionTrigger\" AFTER INSERT ON \"Tag\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"TagUpdatingTrigger\" AFTER UPDATE ON \"Tag\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"TagDeletingTrigger\" AFTER DELETE ON \"Tag\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"TagTruncatingTrigger\" AFTER TRUNCATE ON \"Tag\" FOR EACH STATEMENT EXECUTE PROCEDURE return_data();
    -- triggers on Var
    CREATE OR REPLACE TRIGGER \"VarInsertionTrigger\" AFTER INSERT ON \"Var\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"VarUpdatingTrigger\" AFTER UPDATE ON \"Var\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"VarDeletingTrigger\" AFTER DELETE ON \"Var\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"VarTruncatingTrigger\" AFTER TRUNCATE ON \"Var\" FOR EACH STATEMENT EXECUTE PROCEDURE return_data();
    -- triggers on Type
    CREATE OR REPLACE TRIGGER \"TypeInsertionTrigger\" AFTER INSERT ON \"Type\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"TypeUpdatingTrigger\" AFTER UPDATE ON \"Type\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"TypeDeletingTrigger\" AFTER DELETE ON \"Type\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"TypeTruncatingTrigger\" AFTER TRUNCATE ON \"Type\" FOR EACH STATEMENT EXECUTE PROCEDURE return_data();
    -- triggers on Field
    CREATE OR REPLACE TRIGGER \"FieldInsertionTrigger\" AFTER INSERT ON \"Field\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"FieldUpdatingTrigger\" AFTER UPDATE ON \"Field\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"FieldDeletingTrigger\" AFTER DELETE ON \"Field\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"FieldTruncatingTrigger\" AFTER TRUNCATE ON \"Field\" FOR EACH STATEMENT EXECUTE PROCEDURE return_data();
    -- triggers on NewTypeTmp
    CREATE OR REPLACE TRIGGER \"NewTypeTmpFieldInsertionTrigger\" AFTER INSERT ON \"NewTypeTmp\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"NewTypeTmpFieldUpdatingTrigger\" AFTER UPDATE ON \"NewTypeTmp\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"NewTypeTmpFieldDeletingTrigger\" AFTER DELETE ON \"NewTypeTmp\" FOR EACH ROW EXECUTE PROCEDURE return_data();
    CREATE OR REPLACE TRIGGER \"NewTypeTmpFieldTruncatingTrigger\" AFTER TRUNCATE ON \"NewTypeTmp\" FOR EACH STATEMENT EXECUTE PROCEDURE return_data();
  `
    pool.query({
      text: queryString
    }).then(() => {innerResolve(pool)})
    
  })
}
module.exports = function () {
  return new Promise((innerResolve, reject) => {
    const pg = require ('pg')
    const db_config = require('./db_config')
    const connStr = db_config.db_dialect + '://' + db_config.db_user + ':' + db_config.db_password + '@' + db_config.db_host + ':' + db_config.db_port + '/' + db_config.db_name
    var pool = new pg.Pool({connectionString: connStr})
    var queryString=`
    CREATE TABLE IF NOT EXISTS public."Field"
      (
        id uuid NOT NULL,
        name text COLLATE pg_catalog."default" NOT NULL,
        type uuid NOT NULL,
        logic_values text COLLATE pg_catalog."default",
        um text COLLATE pg_catalog."default",
        CONSTRAINT field_id PRIMARY KEY (id),
        CONSTRAINT unique_field_name UNIQUE (name)
      );
      
      CREATE TABLE IF NOT EXISTS public."FieldPath"
      (
        id uuid NOT NULL,
        CONSTRAINT field_path_id PRIMARY KEY (id)
      );
      
      CREATE TABLE IF NOT EXISTS public."FieldPathElement"
      (
        id uuid NOT NULL,
        field_path uuid NOT NULL,
        index integer NOT NULL,
        field uuid NOT NULL,
        CONSTRAINT field_path_element_id PRIMARY KEY (id)
      );
      
      CREATE TABLE IF NOT EXISTS public."Tag"
      (
        var uuid NOT NULL,
        field_path uuid NOT NULL,
        value bytea NOT NULL,
        CONSTRAINT tag_id PRIMARY KEY (var, field_path)
      );
      
      CREATE TABLE IF NOT EXISTS public."Type"
      (
        id uuid NOT NULL,
        name text NOT NULL,
        CONSTRAINT type_id PRIMARY KEY (id),
        CONSTRAINT unique_type_name UNIQUE (name)
      );
      
      CREATE TABLE IF NOT EXISTS public."TypeFieldPath"
      (
        id uuid NOT NULL,
        type uuid NOT NULL,
        field_path uuid NOT NULL,
        CONSTRAINT type_field_path_id PRIMARY KEY (id)
      );
      
      CREATE TABLE IF NOT EXISTS public."Var"
      (
        id uuid NOT NULL,
        type uuid NOT NULL,
        name text COLLATE pg_catalog."default" NOT NULL,
        CONSTRAINT var_id PRIMARY KEY (id),
        CONSTRAINT unique_var_name UNIQUE (name)
      );
      
      ALTER TABLE IF EXISTS public."Field"
        DROP CONSTRAINT IF EXISTS type_id,
        ADD CONSTRAINT type_id FOREIGN KEY (type)
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
    `;
    pool.query({
      text: queryString
    }).then(() => {innerResolve(pool)})
    
  })
}
module.exports = function validateEnv(){
  const must = ['DB_HOST','DB_PORT','DB_NAME','DB_USER','DB_PASS','DIALECT','PORT','TZ'];
  const miss = must.filter(k=>!process.env[k]);
  if (miss.length){
    console.error('Missing ENV:', miss);
    process.exit(1);
  }
  if (String(process.env.DIALECT).toLowerCase()!=='postgres'){
    console.error('DIALECT must be "postgres"');
    process.exit(1);
  }
};

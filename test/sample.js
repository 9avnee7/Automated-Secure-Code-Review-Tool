// sampleVulnerableFile.js
//here we added some secrets
//  Hardcoded secrets
const apiKey = "api_key=1234567890abcdef1234";
const password = "password: mySuperSecret123!";
const awsKey = "AKIAIOSFODNN7EXAMPLE";

//  Dangerous functions
eval("console.log('This is unsafe!')");
const { exec } = require('child_process');
exec('rm -rf /'); // Dangerous command

const fs = require('fs');
fs.chmod('somefile.txt', 0o777); // Overly permissive

//   This should NOT trigger any issues
const safeFunction = () => {
  const key = process.env.API_KEY;
  console.log("Safe usage:", key);
};

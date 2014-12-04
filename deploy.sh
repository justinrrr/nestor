echo
echo Hello. I only work on Mac. To Change me for your linux variety take a look inside me.
echo
echo =========================
echo Deleting existing junk ...
echo =========================
echo 

rm -rf dist;

echo
echo =========================
echo Building the project...
echo =========================
echo

grunt build;

echo
echo =========================
echo Setting up analytics IDs
echo =========================
echo

cd dist/;

#MAC
sed -i '' 's/MIXPANELTRACKERID/14c327e4d058e91bc4b216a31948e7cd/g' ./index.html;

#Linux
#sed -i 's/MIXPANELTRACKERID/14c327e4d058e91bc4b216a31948e7cd/g' ./index.html;

echo
echo ===================================
echo Zipping the zippable ziipity zapp
echo =================================
echo
gzip -9 scripts/*;

#rename homebrew might need to install
rename s/\.gz$// scripts/*.gz;
#linux
#rename -v 's/\.gz$//' scripts/*.gz;

gzip -9 styles/*;
rename s/\.gz$// styles/*.gz;
#rename -v 's/\.gz$//' styles/*.gz;

echo
echo ===================================
echo Cleaning up the old code from S3
echo =================================
echo

s3cmd del s3://zyring.com/**/*;
s3cmd del s3://zyring.com/*;


echo
echo ===================================
echo Synching the zipped files
echo =================================
echo
s3cmd sync --add-header 'Content-Encoding:gzip' ./scripts s3://zyring.com;
s3cmd sync --add-header 'Content-Encoding:gzip' ./styles s3://zyring.com;


echo
echo ===================================
echo Synching the rest of files
echo =================================
echo

s3cmd sync . s3://zyring.com;


echo
echo ===================================
echo Done. Remember if you have cloudfront cache. You need to invalidate it. Now go and eat a banana.
echo =================================
echo

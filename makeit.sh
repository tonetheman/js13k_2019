#!/bin/bash

BUILD=build
OUT=final.zip
CL=libs/closure-compiler-v20190709.jar

echo "removing stuf..."
rm -rf ${OUT}
rm -rf ${BUILD}

echo "making build dir..."
mkdir ${BUILD}

echo "copying files..."
cp src/index.html ${BUILD}
cp src/ga.js ${BUILD}

echo "moving to build dir..."
cd ${BUILD}

echo "compressing ga..."
java -jar ../${CL} --language_in=ECMASCRIPT5 --js ga.js  --js_output_file out.js

echo "removing not used files..."
rm -f ga.js

echo "zipping dir..."
zip ../${OUT} *

cd ..


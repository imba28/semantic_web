#!/bin/bash

core='series'
port=8983
file='series.json'
data=0

while getopts ":p:df:hc:" opt; do
  case $opt in
    p)
      port=$OPTARG
      ;;
    d)
      data='{"delete": {"query": "*:*"},"commit": {}}'
      file=0
      ;;
    f)
      file=$OPTARG
      ;;
    c)
      core=$OPTARG
      ;;
    h)
      echo "Usage: $0 [option...]" >&2
      echo "    -f file      select file containing json datasets, default is \`$file\`" >&2
      echo "    -c core      select solr core name, default is \`$core\`" >&2
      echo "    -p port      set custom solr port number, default is \`$port\`" >&2
      echo "    -d           delete all core records" >&2
      exit 1
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

if [[ $file != 0 ]]; then 
  data=$(cat $file)
fi

echo 'sending data...' >&2
response=$(echo $data | curl "http://localhost:$port/solr/$core/update/json?commit=true" -S -s --data-binary @- -H 'Content-type:application/json')

if [[ $response = *"\"status\":0"* ]]; then
  echo "done." >&2
else
  echo $response >&2
fi
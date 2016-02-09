#! /bin/bash
comma="n"
	printf '{
	"tiddlers": ['
while read x ; do 
if [ ${x##*.} = "js" ]; then 
		if [ $comma = "y" ]; then 
			printf ','
		else	
			comma="y"
		fi
		printf '
		{
			"file": "%s",
			"fields": {
				"type": "application/javascript",
				"title": "$:/plugins/bj/visualeditor/%s",
				"module-type": "library"
			}
		}' $x $x ;
elif [ ${x##*.} = "png" ]; then 
		if [ $comma = "y" ]; then printf ','
		else	comma="y"
		fi
		printf '
		{
			"file": "%s",
			"fields": {
				"type": "image/png",
				"title": "$:/plugins/bj/visualeditor/%s",
				"module-type": "library"
			}
		}' $x $x ;
elif [ ${x##*.} = "tid" ]; then 
		if [ $comma = "y" ]; then printf ','
		else	comma="y"
		fi
		printf '
		{
			"file": "%s",
			"fields": {
				"type": "text/vnd.tiddlywiki",
				"title": "$:/plugins/bj/visualeditor/%s",
				"module-type": "library"
			}
		}' $x ${x%.*};
elif [ ${x##*.} = "json" ]; then 
		if [ $comma = "y" ]; then printf ','
		else	comma="y"
		fi
		printf '
		{
			"file": "%s",
			"fields": {
				"type": "application/json",
				"title": "$:/plugins/bj/visualeditor/%s",
				"module-type": "library"
			}
		}' $x $x ;
elif [ ${x##*.} = "css" ]; then 
		if [ $comma = "y" ]; then printf ','
		else	comma="y"
		fi
		printf '
		{
			"file": "%s",
			"fields": {
				"title": "$:/plugins/bj/visualeditor/%s"
			}
		}' $x $x ;
fi
 done
printf '
	]
}
'

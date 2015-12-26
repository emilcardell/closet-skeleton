if docker ps -a | grep -q applicationdb; then
		echo "applicationdb EXISTS";
	else
    	echo "INSTALLING applicationdb";
		docker run --name applicationdb -p 27017:27017 -d mongo
fi

if docker ps -a | grep -q  rapids-rabbit; then
		echo "logdb EXISTS";
	else
    	echo "INSTALLING  logdb";
	    docker run --name logdb -p 9200:9200 -p 9300:9300 -d elasticsearch
fi

#!/bin/bash

isOnline=$(service postgresql status)

if [[ $isOnline =~ "online" ]]; then
	echo "Server is online :)"
else
	echo "Server is Offline :("
	sudo service postgresql start
fi

rails server

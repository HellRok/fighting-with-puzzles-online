fighting_with_puzzles_online:
	docker build . --pull --tag fighting_with_puzzles_online

digest-assets:
	JSSUM="$$(md5sum ./public/assets/application.js | cut -f 1 -d" ")"; \
		mv ./public/assets/application.js ./public/assets/application.$$JSSUM.js; \
		sed -i "s/application.js/application.$$JSSUM.js/g" ./app/views/home/index.html.erb;
	CSSSUM="$$(md5sum ./public/assets/application.css | cut -f 1 -d" ")"; \
		mv ./public/assets/application.css ./public/assets/application.$$CSSSUM.css; \
		sed -i "s/application.css/application.$$CSSSUM.css/g" ./app/views/home/index.html.erb;

FONT_DIR      ?= ./fontello
FONTELLO_HOST ?= http://fontello.com

font-edit:
	@if test ! `which curl` ; then \
		echo 'Install curl first.' >&2 ; \
		exit 128 ; \
		fi
	curl --silent --show-error --fail --output .fontello \
		--form "config=@fontello.json" \
		${FONTELLO_HOST}
	echo "${FONTELLO_HOST}/`cat .fontello`"


font-save:
	@if test ! `which unzip` ; then \
		echo 'Install unzip first.' >&2 ; \
		exit 128 ; \
		fi
	@if test ! -e .fontello ; then \
		echo 'Run `make fontopen` first.' >&2 ; \
		exit 128 ; \
		fi
	rm -rf .fontello.src .fontello.zip
	curl --silent --show-error --fail --output .fontello.zip \
		${FONTELLO_HOST}/`cat .fontello`/get
	unzip .fontello.zip -d .fontello.src
	rm -rf ${FONT_DIR}
	mv `find ./.fontello.src -maxdepth 1 -name 'fontello-*'` ${FONT_DIR}
	rm -rf .fontello.src .fontello.zip
	mv ${FONT_DIR}/config.json ./fontello.json
	mv ./fontello/css/fontello-embedded.css ./app/stylesheets/_icons.scss
	rm -rf ${FONT_DIR}

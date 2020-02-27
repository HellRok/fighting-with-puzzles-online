fighting_with_puzzles_online:
	docker build . --pull --tag fighting_with_puzzles_online

digest-assets:
	./bin/digest_asset public/assets/audio/lock.mp3 public/assets/application.js
	./bin/digest_asset public/assets/audio/lose.mp3 public/assets/application.js
	./bin/digest_asset public/assets/audio/win.mp3 public/assets/application.js
	./bin/digest_asset public/assets/gems.png app/views/home/index.html.erb public/assets/application.css
	./bin/digest_asset public/assets/application.js app/views/home/index.html.erb
	./bin/digest_asset public/assets/application.css app/views/home/index.html.erb

update-normalize:
	wget https://cdn.rawgit.com/necolas/normalize.css/master/normalize.css --output-document app/stylesheets/normalize.css

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

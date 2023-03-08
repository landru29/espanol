APP_NAME =        espanol
DEL =             rm -rf
DOCKER =          docker
DOCKER_REGISTRY = docker.searace.org:5443

GIT_CURRENT_HASH=$(shell git log -n1 --pretty='%h')
TAG:=$(shell git describe --exact-match --tags $(GIT_CURRENT_HASH) 2>/dev/null)
TAG:=$(TAG) latest
DOCKER_IMAGES := $(foreach t, $(TAG), $(shell echo '-t $(DOCKER_REGISTRY)/$(APP_NAME):$(t)' ))

.PHONY: build clean package docker publish

build: node_modules
	npm run build && cd build && git init && git remote add origin git@github.com:landru29/landru29.github.io.git && git add . && git commit -m "Initial commit"

publish: build
	cd build && git push --set-upstream origin master --force

docker: clean
	$(DOCKER) build \
	    --ssh build_key=${BUILD_SSH_KEY} \
		$(DOCKER_IMAGES) \
		.

package: docker
	for tag in $(TAG); do\
		$(DOCKER) push $(DOCKER_REGISTRY)/$(APP_NAME):$$tag ;\
	done

clean:
	$(DEL) build
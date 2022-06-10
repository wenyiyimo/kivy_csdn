watch: {
        playurl(newurl, oldurl) {
            if (newurl != '') this.playvideo();
        }
    },
    methods: {
        playvideo() {
            this.videoContext.setStyles({ src: this.playurl });
            this.videoContext.play();
            this.playurl = '';

        },

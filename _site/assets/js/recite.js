/// <reference path="./typings/index.d.ts" />
//import * as $ from "jquery";
var easyquiz = /** @class */ (function () {
    function easyquiz() {
        var _self = this;
        if (!this.isLocalstorageExist()) {
            $('#onlyremember').prop('disabled', true);
            $('#wordremember').prop('disabled', true);
        }
        var rwords = JSON.parse(localStorage.getItem("rwords"));
        this.rwords = rwords || {};
        $('#wordremember').change(function () {
            if (this.checked) {
                rwords[_self.quiz.rid] = true;
                _self.quiz.rem = true;
            }
            else {
                delete rwords[_self.quiz.rid];
                _self.quiz.rem = false;
            }
            localStorage.setItem("rwords", JSON.stringify(rwords));
        });
        $('#trialtext').keypress(function (e) {
            if (e.which == 13) {
                var autoremember = $('#autoremember').prop('checked');
                _self.rollquiz(1);
                _self.displayquiz();
                if (autoremember && $(this).val() == _self.quiz.read) {
                    $("#wordremember").prop('checked', true).change();
                }
                return false;
            }
        });
        $('#content').on('click', "a.read", function (e) {
            e.preventDefault();
            _self.speak($(this).data('read'));
        });
        $('button.toggle-next').on('click', function (e) {
            e.preventDefault();
            _self.rollquiz(1);
            _self.displayquiz();
        });
        $('button.toggle-next-left').on('click', function (e) {
            e.preventDefault();
            var remembereddiv = ($('#remembereddiv')).detach();
            ($('#trialdiv')).before(remembereddiv);
        });
        $('button.toggle-next-right').on('click', function (e) {
            e.preventDefault();
            var trialdiv = ($('#trialdiv')).detach();
            ($('#remembereddiv')).before(trialdiv);
        });
        $('button.toggle-previous').on('click', function (e) {
            e.preventDefault();
            _self.rollquiz(-1);
            _self.displayquiz();
        });
    }
    easyquiz.prototype.isLocalstorageExist = function () {
        var mod = 'test';
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    easyquiz.prototype.start = function (data) {
        this.quizdata = data;
        for (var i = 0; i < this.quizdata.length; i++) {
            this.quizdata[i].rem = this.rwords[this.quizdata[i].rid];
        }
        var shufflewords = $('#shufflewords').prop('checked');
        if (shufflewords)
            this.quizdata = this.quizdata.sort(function () { return 0.5 - Math.random(); });
        ;
        this.quizid = -1;
        this.rollquiz(1);
        this.displayquiz();
    };
    ;
    easyquiz.prototype.displayquiz = function () {
        $("#content").html(this.quizid % 2 == 0 ? this.quiz.tip : this.quiz.desc);
        $("#card-summary").html((this.quiznum + 1) + '/' + (this.quizdata.length) + '(' + this.countRememberedWords() + ')');
        $("#wordremember").prop('checked', this.quiz.rem ? true : false);
    };
    easyquiz.prototype.countRememberedWords = function () {
        var tt = 0;
        for (var i = 0; i < this.quizdata.length; i++) {
            if (this.rwords[this.quizdata[i].rid])
                tt++;
        }
        return tt;
    };
    easyquiz.prototype.rollquiz = function (offset) {
        if (this.quizid + offset < 0 || this.quizid + offset >= this.quizdata.length * 2)
            return;
        var onlyremember = $('#onlyremember').prop('checked');
        var autoreadword = $('#autoreadword').prop('checked');
        do {
            this.quizid += offset;
            this.quiznum = Math.floor(this.quizid / 2);
            this.quiz = this.quizdata[this.quiznum];
        } while (this.quizid > 0 && this.quizid < this.quizdata.length * 2 - 1 && onlyremember && this.quiz.rem);
        if (this.quizid % 2 == 0)
            $('#trialtext').val('');
        if (autoreadword && this.quizid % 2 != 0)
            this.speak(this.quiz.read);
    };
    easyquiz.prototype.speak = function (word) {
        if ('speechSynthesis' in window) {
            // 检查全局的 speechReady 变量
            if (typeof window['speechReady'] !== 'undefined' && !window['speechReady']) {
                var _self = this;
                setTimeout(function () { _self.speak(word); }, 100);
                return;
            }
            var speech = new SpeechSynthesisUtterance(word);
            speech.lang = 'ja-JP';
            // 优化语音设置
            speech.rate = 0.9; // 稍微慢一点，更清晰
            speech.pitch = 1.0;
            speech.volume = 1.0;
            window.speechSynthesis.speak(speech);
        }
    };
    return easyquiz;
}());
;

// not_started, entering_user_data, answering, finished
var questions_app = new Vue({
	el: '#questions_app',
	data: {
		questions: [],
		user_data: {
			name: "",
			phone: "",
			email: "",
			birthday: ""
		},
		current_question: -1,
		question_time: 20,
		last_timer_id: null,
		state: "not_started",
		// state: "answering",
	},
	created: function () {
		let ths = this;
		$.get( "data.json", function(data) {
			console.log(data)
			ths.questions = data['questions'];
		});
	},
	computed: {
		missingName: function () { 
			return this.user_data.name === '';
		},
		validateDate: function(){
			let dateRe = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
			console.log(dateRe.test(this.user_data.birthday))
			return dateRe.test(this.user_data.birthday);
		},
		validateEmail: function (event) {
			let emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			return emailRE.test(this.user_data.email);
		},
		validateForm: function(){
			return !this.missingName && this.validateEmail && this.validateDate;
		}
	},
	methods: {
		changeState: function(state){
			console.log(this.questions)
			this.state = state;
			if (state == "answering") {
				this.nextQuestion();
			}
			if(state == "finished"){
				this.user_data.score = 0;
			    for (var i = 0; i < this.questions.length; i++) {
			    	if(this.questions[i].answer == this.questions[i].user_answer){
			    		this.user_data.score++;
			    	}
			    }
			}
		},
		nextQuestion: function(){
			if (this.current_question + 1 != this.questions.length){
				this.current_question++;
				this.question_time = 20;
				clearTimeout(this.last_timer_id);
				this.last_timer_id = setTimeout(this.nextQuestion, 20000);
			}else{
				this.changeState('finished');
				this.sendUserData();
			}
			if (this.current_question == 0) {
				let ths = this;
				let qt = function(){
					ths.question_time--;
				}
				setInterval(qt, 1000);
			}
		},
		sendUserData: function()
        {
        	if(!this.sended){
	        	this.sended = true;
	         	let user_data = this.user_data;
	         	let success = function(){}
				$.ajax({
					type: "POST",
					url: "data_handler.php",
					data: user_data,
					success: success,
					dataType: 'json',
				});
			}
        },
	}
})
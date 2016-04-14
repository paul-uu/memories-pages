(function() {

	// ----------------------------------------------------------
	// Date stuff:
	Date.prototype.today = function () {  // today's date;
		return (((this.getMonth()+1) < 10) ? '0':'') + (this.getMonth()+1) +'/'+ ( (this.getDate() < 10) ? '0':'') + this.getDate() +'/'+ this.getFullYear();
	};
	Date.prototype.timeNow = function () {  // current time
		return ((this.getHours() < 10) ? '0':'') + this.getHours() +':'+ ((this.getMinutes() < 10) ? '0':'') + this.getMinutes();
	};
	var today = new Date();
	var date = today.today();


	/* jQuery UI Slider */
	var $slide_handles = $('#emotion_sliders .ui-slider-handle');

	$('.emotion_slider').slider({
		range: 'min',
		value: 0,
		min: 0,
		max: 5,
		/*slide: function(e, ui) {
			$(this).find('.slider_value').text(ui.value);
		}*/
	});

	var attachments_dialog = $('#attachments_dialog').dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"Add attachment": add_attachment,
			Cancel: function() {
				attachments_dialog.dialog('close');
			}
		},
		close: function() {
			console.log('close modal');

		}
	});
	function add_attachment() {
		console.log('add attachment');
	}
	$('.input_attachments_tab').on('click', function() {
		attachments_dialog.dialog('open');
	});


	// ----------------------------------------------------------
	// Backbone stuff:
	
	// --------------------
	// Model
	var Memory_Model = Backbone.Model.extend({
		defaults: {
			'date': date,
			'memory_text': '',
			'media': {
				'image': '',
				'video':'',
				'audio':''
			},
			'emotions': {
				'joy': 0,
				'sadness': 0,
				'anger': 0,
				'fear': 0,
				'disgust': 0,
				'neutral': 0
			},
			'gradient': {
				'default': '',
				'webkit': '',
				'moz': ''
			}
		}
	});

	// --------------------
	// Collection (rename to hippocampus?)
	var Memory_Collection = Backbone.Collection.extend({
		model: Memory_Model,
		localStorage: new Backbone.LocalStorage('Memory_LocalStorage')
	});
	var my_memory = new Memory_Collection();
	my_memory.fetch();


	// ---------------------
	// View for Memory Display
	var Memory_Display = Backbone.View.extend({
		el: $('#memory_display'),
		events: {
			'click #memory-display-close': 'close_display',
			'click .memory-display-delete': 'delete_memory' 
		},
		initialize: function() {
		},
		render: function(model) {
			this.current_memory = model;
			this.$el.animate({
				top: '150px'
			}, 850, 'easeOutQuart');
			this.$el.find('.memory-display-date').text(model.attributes.date);
			this.$el.find('.memory-display-text').text(model.attributes.memory_text);
		},
		current_memory: '',
		close_display: function() {
			this.$el.animate({
				top: '-205px'
			}, 850, 'easeOutQuart', function() {
				$('.memory-active').removeClass('memory-active');
			});
		},
		delete_memory: function() {
			this.current_memory.destroy();
			this.close_display();
			memories.render();
		}
	});
	var memory_display_view = new Memory_Display();
	


	// ---------------------
	// View for Control Panel
	var Control_Panel = Backbone.View.extend({
		el: $('#control_panel'),
		events: {
			'click #save_memory': 'save_memory'
		},
		initialize: function() {
			this.render();
		},
		render: function() {
			console.log('control panel render()');
			this.$el.find('#input_memory').val('');
			this.$el.find('.emotion_slider').slider('value', 0);
		},
		save_memory: function() {
			// gather input values
			var emotions = {},
				input = this.$el.find('#input_memory').val(),
				joy = this.$el.find('#slider_joy').slider('value'),
				sadness = this.$el.find('#slider_sadness').slider('value'),
				anger = this.$el.find('#slider_anger').slider('value'),
				fear = this.$el.find('#slider_fear').slider('value'),
				disgust = this.$el.find('#slider_disgust').slider('value'),
				neutral = this.$el.find('#slider_neutral').slider('value');

			if (joy)
				emotions['joy'] = joy;
			if (sadness)
				emotions['sadness'] = sadness;
			if (anger)
				emotions['anger'] = anger;
			if (fear)
				emotions['fear'] = fear;
			if (disgust)
				emotions['disgust'] = disgust;
			if (neutral)
				emotions['neutral'] = neutral;	

			var new_memory = new Memory_Model({
				'date': date,
				'memory_text': input,
				'emotions': {
					'joy': joy,
					'sadness': sadness,
					'anger': anger,
					'fear': fear,
					'disgust': disgust,
					'neutral': neutral
				},
				'gradient': {
					'default': '',
					'webkit': '',
					'moz': ''
				}
			});

			// access model data via: new_memory.attributes.(properties here)
			// convert slider input values to a linear gradient string
			var gradient_str = emotions_to_gradient(new_memory);
			new_memory.attributes.gradient.default = gradient_str;

			my_memory.add(new_memory);
			new_memory.save();
			this.render();								
		}
	});
	var control_panel = new Control_Panel();


	// --------------------------
	// View for individual memory
	var Memory_View = Backbone.View.extend({
		tagName: 'div',
		className: 'memory',
		events: {
			'click': 'view_memory',
		},
		template: _.template($('#memory_template').html()),
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html(this.template(this.model));
			//this.$el.css({'background': this.model.attributes.gradient.default.toString() });
			this.$el.attr('style', 'background: ' + this.model.attributes.gradient.default.toString());
			return this;
		},
		delete_memory: function() {
			this.model.destroy();	// delete model
			this.remove();			// delete view
		},
		// Custom Events
		view_memory: function() {
			$('.memory-active').removeClass('memory-active')
			this.$el.addClass('memory-active');
			memory_display_view.render(this.model);
		},
		/*
		add_gradient: function($el) {
			var m = this.model.attributes;
			$(this).css({
				'background-color': m.gradient,
				'background-color': m.webkit_gradient
			});
		}
		*/
	}); 


	var $memory_display = $('#memory_display');
	// --------------------------
	// View for Memory Collection
	var Memories_View = Backbone.View.extend({
		el: $('#memory_container'),
		events: {  },
		initialize: function() {
			this.collection = my_memory;
			this.collection.toJSON();
			this.render();
			this.collection.on('add', this.render_item, this);
			this.collection.on('remove', this.remove_item, this);
		},
		render: function() {
			this.$el.html('');
			var that = this;
			_.each(this.collection.models, function(model) {
				that.render_item(model);
			}, this);
		},
		render_item: function(model) {
			if (model) {
				var model_view = new Memory_View({ model: model });
				this.$el.append(model_view.render().el);
			}
		}
	});
	var memories = new Memories_View();




	/* --------------------------------------------------------------------------- */
	/* Extra Functions */

	function emotions_to_gradient(memory_model) {

		var emotions = {},
			m = memory_model.attributes.emotions;

		if (m.joy)
			emotions['joy'] = m.joy;
		if (m.sadness)
			emotions['sadness'] = m.sadness;
		if (m.anger)
			emotions['anger'] = m.anger;
		if (m.fear)
			emotions['fear'] = m.fear;
		if (m.disgust)
			emotions['disgust'] = m.disgust;
		if (m.neutral)
			emotions['neutral'] = m.neutral;

		var emotions_percent_obj = _.mapObject(emotions, function(val, key) {
			return Math.floor( (val/sum_obj_values(emotions)) * 100 );
		});

		var gradient_str = 'linear-gradient(to bottom, ',
			current_percentage = 0,
			i = 0,
			obj_len = Object.keys(emotions_percent_obj).length,
			value;

		for (emotion in emotions_percent_obj) {
			if (i === (obj_len - 1)) {
				value = ');'; // last object property / emotion; end gradient_str
			} else {
				current_percentage += emotions_percent_obj[emotion];
				value = current_percentage + '%, ';
			}
			gradient_str += get_emotion_color(emotion) + ' ' + value;
			i++;
		}
		return gradient_str;
	}


	// Sum all values (that are numbers) in an object
	function sum_obj_values(obj) {
		var sum = 0;
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop))
				sum += obj[prop];
		}
		return sum;
	}

	function get_emotion_color(emotion_str) {
		switch (emotion_str) {
			case 'joy':
				return 'yellow';
				break;
			case 'sadness':
				return 'blue';
				break;
			case 'anger':
				return 'red';
				break;
			case 'fear':
				return 'purple';
				break;
			case 'disgust':
				return 'green';
				break;
			case 'neutral':
				return '#ddd';
				break;																		
		}
	}


})();
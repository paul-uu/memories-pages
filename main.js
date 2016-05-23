/* --------------------------------------------------------------- */
/* Date stuff: */
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days   = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var today = new Date();
var year  = today.getFullYear(),
	month = months[today.getMonth()],
	date  = today.getDate(),
	day   = days[today.getDay()],
	hour = today.getHours(),
	mins = today.getMinutes(),
	raw  = Date.now();

var am_pm = hour > 12 ? 'pm': 'am';
var time_string = (hour % 12).toString() + ':' + mins.toString() + ' ' + am_pm;


/* --------------------------------------------------------------- */
/* dynamically correct height of #aggregate_meter */
var $control_panel = $('#control_panel'),
	$aggregate_meter = $('#aggregate_meter'),
	$window = $(window);

function update_aggregate_meter_height() {
	var cp_height = $control_panel.height();	
	$aggregate_meter.css('height','calc(100% - ' + cp_height.toString() + 'px)');
}
$window.on('resize', function() {
	update_aggregate_meter_height();	
});
update_aggregate_meter_height();





/* --------------------------------------------------------------- */
(function() {

	
	// --------------------
	// Memory Model
	var Memory_Model = Backbone.Model.extend({
		defaults: {

			'date_time': {
				'year': year,
				'month': month,
				'date': date,
				'day': day,
				'time': time_string,
				'raw': raw
			},
			'memory_text': null,
			'media': {
				'image': null,
				'video':null,
				'audio':null
			},
			'emotions': {
				'joy': {
					'value': null,
					'percentage': null
				},
				'sadness': {
					'value': null,
					'percentage': null
				},
				'anger': {
					'value': null,
					'percentage': null
				},
				'fear': {
					'value': null,
					'percentage': null
				},
				'disgust': {
					'value': null,
					'percentage': null
				},
				'neutral': {
					'value': null,
					'percentage': null
				}
			},
			'gradient': {
				'default': null,
				'webkit': null,
				'moz': null
			}
		},
		emotion_vals_to_percentages: function() {

			var emotions = this.attributes.emotions,
				total = 0;
			/* calculate total of emotion values */
			for(var emotion in emotions) {
				if (emotions[emotion].value)
					total += emotions[emotion].value;
			}
			/* assign percentage values to emotions using total */
			for (var emotion in emotions) {
				if (emotions[emotion].value)
					emotions[emotion].percentage = Math.floor( (emotions[emotion].value / total) * 100);
			}
		},
		percentages_to_gradient_string: function() {

			var current_percentage = 0,
				emotions = this.attributes.emotions,
				num_of_emotions = 0,
				i = 1, /* to act as index in the for in loop */
				str_value,
				gradient_str = 'linear-gradient(to bottom, '; /* partial css linear-gradient string */

			// determine number of emotions with values/percentages
			for ( var emotion in emotions ) 
				if (emotions[emotion].percentage) num_of_emotions++;

			// if only 1 emotion value, linear gradient is not used
			if (num_of_emotions === 1) {
				for (emotion in emotions)
					if (emotions[emotion].percentage) {
						this.attributes.gradient.default = emotion_translate(emotion, 'color');
						return;
					}
			}

			// build linear-gradient string
			for (emotion in emotions) {
				if (emotions[emotion].percentage) {
					if (i === num_of_emotions)
						str_value = ');'; /* this ends the css gradient_str */
					else {
						current_percentage += emotions[emotion].percentage;
						str_value = current_percentage + '%, ';
					}
					gradient_str += emotion_translate(emotion, 'color') + ' ' + str_value;
					i++;		
				}
			}
			this.attributes.gradient.default = gradient_str;
		}
	});



	// --------------------
	// Memories Collection (rename to hippocampus?)
	var Memory_Collection = Backbone.Collection.extend({
		model: Memory_Model,
		localStorage: new Backbone.LocalStorage('Memory_LocalStorage'),
		comparator: function(a, b) {
			return a.get('date_time')['raw'] < b.get('date_time')['raw'] ? -1 : 1;
		},
		greaterThan: function(value) {
			var filtered = this.filter(function(memory) {
				return memory.get('emotions')[value].percentage > 0;
			});
			return new Memory_Collection(filtered);
		}
	});
	var my_memory = new Memory_Collection();
	var superset = new Memory_Collection();
	my_memory.fetch();
	superset.fetch();





	// ---------------------
	// View for Control Panel
	var Control_Panel = Backbone.View.extend({
		el: $('#control_panel'),
		events: {
			'click #add_memory'      : 'add_memory',
			'change #sort_select'    : 'collection_sort',
			'change #filter_select'  : 'filter_by'
		},
		initialize: function() {
			this.render();
		},
		render: function() {
		},
		add_memory: function() {
			memory_add_modal.render();
		},
		collection_sort: function(e) {
			var val = $(e.currentTarget).val();
			if ( val === 'newest' || val === 'oldest' )
				memories.sort_by_date(val);
			else
				memories.sort_by_emotion(val);
		},
		filter_by: function(e) {
			var filter = $(e.currentTarget).val();
			memories.filter_by_emotion(filter);
		}
	});
	var control_panel = new Control_Panel();




	// -------------------------
	// View for Add Memory Modal
	var Memory_Add_Modal = Backbone.View.extend({
		el: $('#add_memory_dialog'),
		events: {
			'click #modal_cancel'          : 'close',
			'click .modal_close'           : 'close',
			'click .input_attachment_icon' : 'toggle_attachment',
			'click #modal_reset'           : 'reset',
			'click #save_new_memory'       : 'save_memory',
			'click #add_audio_attachment'  : 'add_audio_attachment',
			'click #add_image_attachment'  : 'add_image_attachment',
			'click #add_video_attachment'  : 'add_video_attachment',			
			'keyup #input_memory'          : function() { 
												this.validate();
												this.new_memory.attributes.memory_text = $('#input_memory').val();
											 }
		},
		initialize: function() {
			var view = this;

			view.new_memory = null;
			view.initialize_new_memory();
			autosize($('#input_memory'));
			$('.emotion_slider').slider({
				//orientation: 'vertical',
				change: function(e, ui) {
					view.validate(e, ui);
					var el_id = $(e.target).attr('id');
					var prop = el_id.substring(el_id.indexOf('_') + 1, el_id.length);
					view.new_memory.attributes.emotions[prop]['value'] = ui.value;
				},
				range: 'min',
				value: 0,
				min: 0,
				max: 5,
			});
		},
		render: function() {
			this.$el.addClass('view');
			$('.input_attachment_icon').removeClass('active');
			$('#input_memory').focus();
		},
		render_model_data: function() {

			var memory = this.new_memory.attributes;

			// emotions:
			for (emotion in memory.emotions) {
				this.render_emotion_slider(emotion, memory.emotions[emotion]);
			}

			// attachments:
			for (attachment in memory.media) {
				this.render_attachment_status(attachment, memory.media[attachment])
			}
		},
		render_emotion_slider: function(emotion_type, emotion_value) {
			$('#slider_' + emotion_type).slider('value', emotion_value);
		},
		render_attachment_status: function(attachment_type, attachment_value) {
			switch (attachment_type) {
				case 'audio':
					var $attch_icon = $('#attachment_button_audio > .attachment_check');
					attachment_value ? $attch_icon.removeClass('hide') : $attch_icon.addClass('hide');
					break;
				case 'image':
					var $attch_icon = $('#attachment_button_image > .attachment_check');
					attachment_value ? $attch_icon.removeClass('hide') : $attch_icon.addClass('hide');
					break;
				case 'video':
					var $attch_icon = $('#attachment_button_video > .attachment_check');
					attachment_value ? $attch_icon.removeClass('hide') : $attch_icon.addClass('hide');
					break;
			}
		},
		clear: function() {
			$('#input_memory').val('');
			$('.emotion_slider').slider('value', 0);
		},
		close: function() {
			this.$el.removeClass('view');
		},

		toggle_attachment: function(e) {
			var $icon = $(e.target).closest('.input_attachment_icon'),
				attachment_type = $icon.attr('data-attachment-type');
			
			$icon.toggleClass('active').siblings().removeClass('active');

			if ($icon.hasClass('active')) {
				this.toggle_attachment_input(attachment_type);
			} else {
				this.toggle_attachment_input(false);
			}
		},
		validate: function(slide_event, slide_ui) {
			var view = this;

			// check for text input upon memory save
			if (! $('#input_memory').val() ) {
				//display_noty('warning', 'topCenter', 'Please enter a memory');
				view.handle_save_button('disable')
				return;
			}

			// check for emotion slider value(s) upon memory save
			var sliders_valid = false;
			this.$el.find('.emotion_slider').each(function(i, el) {
				if ( $(this).slider('value') > 0 ) {
					sliders_valid = true;
					return;
				}
			}).promise().done(function() {
				if (!sliders_valid) {
					//display_noty('warning', 'topCenter', 'Please enter an emotion value(s)');
					view.handle_save_button('disable');
					return;
				} else {
					view.handle_save_button('enable');
				}
			});

		},
		handle_save_button: function(action) {
			if (action === 'enable') {
				$('#save_new_memory').addClass('enabled');
			}
			else if (action === 'disable') {
				$('#save_new_memory').removeClass('enabled');
			}
		},
		toggle_attachment_input: function(type) {
			var $input_div = $('.attachments_input');
			if (type) {
				switch (type) {
					case 'audio':
						$input_div.html('<input id="audio_text_input" data-attachment-type="audio" type="text" placeholder="enter audio url here"><button id="add_audio_attachment">update</button>');
						$('#audio_text_input').val(this.new_memory.attributes.media.audio);
						break;
					case 'image':
						$input_div.html('<input id="image_text_input" data-attachment-type="image" type="text" placeholder="enter image url here"><button id="add_image_attachment">update</button>');
						break;
					case 'video':
						$input_div.html('<input id="video_text_input" data-attachment-type="video" type="text" placeholder="enter video url here"><button id="add_video_attachment">update</button>');
						break;
					default:
						console.log('error - toggle_attachment_input');
						break;												
				}
			} else 
				$input_div.html('');
		},
		add_audio_attachment: function() {
			var $input_val = $('#audio_text_input').val();
			this.new_memory.attributes.media.audio = $input_val;
			this.render_model_data();
		},
		add_image_attachment: function() {
			var $input_val = $('#image_text_input').val();
			this.new_memory.attributes.media.image = $input_val;
			this.render_model_data();
		},
		add_video_attachment: function() {
			var $input_val = $('#video_text_input').val();
			this.new_memory.attributes.media.video = $input_val;
			this.render_model_data();
		},
		validate_url: function(url) {
			return url.match(/^HTTP|HTTP|http(s)?:\/\/(www\.)?[A-Za-z0-9]+([\-\.]{1}[A-Za-z0-9]+)*\.[A-Za-z]{2,40}(:[0-9]{1,40})?(\/.*)?$/);		
		},		
		initialize_new_memory: function() {
			this.new_memory = new Memory_Model({
				'date': date,
				'memory_text': '',
				'media': {
					'image': '',
					'video':'',
					'audio':''
				},
				'emotions': {
					'joy': {
						'value': 0,
						'percentage': 0
					},
					'sadness': {
						'value': 0,
						'percentage': 0
					},
					'anger': {
						'value': 0,
						'percentage': 0
					},
					'fear': {
						'value': 0,
						'percentage': 0
					},
					'disgust': {
						'value': 0,
						'percentage': 0
					},
					'neutral': {
						'value': 0,
						'percentage': 0
					}
				},
				'gradient': {
					'default': '',
					'webkit': '',
					'moz': ''
				}
			});
		},		
		save_memory: function() {

			this.new_memory.emotion_vals_to_percentages();
			this.new_memory.percentages_to_gradient_string();

			my_memory.add(this.new_memory);
			this.new_memory.save();
	
			this.close();
			this.clear();
		},
		reset: function() {
			console.log('reset()');
			this.initialize_new_memory();
			this.render_model_data();
		}
	});
	var memory_add_modal = new Memory_Add_Modal();



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
				top: '98px'
			}, 850, 'easeOutQuart');

			$('.emotions-meter-segment').css('width', 0);

			var emotions = model.attributes.emotions;
			for (var emotion in emotions) {
				if (emotions[emotion]['percentage'])
					$('.segment-' + emotion).css('width', emotions[emotion]['percentage']+'%');
			}

			this.$el.find('.memory-display-day').text(model.attributes.date_time.day);
			this.$el.find('.memory-display-time').text(model.attributes.date_time.time);			
			this.$el.find('.memory-display-month').text(model.attributes.date_time.month);
			this.$el.find('.memory-display-date').text(model.attributes.date_time.date);
			this.$el.find('.memory-display-year').text(model.attributes.date_time.year);
			this.$el.find('.memory-display-text').text(model.attributes.memory_text);
		},
		current_memory: '',
		close_display: function() {
			this.$el.animate({
				top: '-265px'
			}, 850, 'easeOutQuart', function() {
				$('.memory-active').removeClass('memory-active');
			});
		},
		delete_memory: function() {
			this.current_memory.destroy();
			this.close_display();
		}
	});
	var memory_display_view = new Memory_Display();
	




	// --------------------------
	// View for individual memory
	var Memory_View = Backbone.View.extend({
		tagName: 'div',
		className: 'memory',
		events: {
			'click': 'view_memory',
		},
		template: _.template($('#memory_template').html()),
		render: function() {
			this.$el.html(this.template(this.model));
			this.$el.attr('style', 'background: ' + this.model.attributes.gradient.default.toString());
			return this;
		},
		remove_memory: function() {
			this.model.destroy();	// delete model
			this.remove();			// delete view
		},
		// Custom Events
		view_memory: function() {
			if (this.$el.hasClass('memory-active')) {
				memory_display_view.close_display();
			} else {
				$('.memory-active').removeClass('memory-active')
				this.$el.addClass('memory-active');
				memory_display_view.render(this.model);				
			}
		}
	}); 




	var $memory_display = $('#memory_display'),
		$memory_number  = $('#memories_num');
	// --------------------------
	// View for Memory Collection
	var Memories_View = Backbone.View.extend({
		el: $('#memory_container'),
		events: {
			'click .sort_by_emotion' : 'sort_by_emotion',
		},
		initialize: function() {

			this.collection = my_memory;
			this.render();

			this.collection.on('add', this.render, this);
			this.collection.on('remove', this.render, this);
		},

		render: function() {
			this.$el.html('');
			this.collection.each(function(memory) {
				var memory_view = new Memory_View({model: memory});
				this.$el.append(memory_view.render().el);
			}, this);
			$memory_number.text( this.$el.children('.memory').length );
			return this;
		},
		delete_collection: function() {
			this.collection.each(function(model) {
				model.destroy();
			});
			this.render();
		},

		sort_by_emotion: function(emotion) {
			this.collection.comparator = function(a, b) {
				return a.get('emotions')[emotion]['percentage'] < b.get('emotions')[emotion]['percentage'] ? -1 : 1;
			}
			this.collection.sort();
			this.render();
		},
		sort_by_date: function(direction) {
			if (direction === 'newest') {
				this.collection.comparator = function(a, b) {
					return a.get('date_time')['raw'] < b.get('date_time')['raw'] ? -1 : 1;
				}				
			} else if (direction === 'oldest') {
				this.collection.comparator = function(a, b) {
					return a.get('date_time')['raw'] > b.get('date_time')['raw'] ? -1 : 1;
				}		
			}

			this.collection.sort();
			this.render();
		},

		// triggered from control panel view
		filter_by_emotion: function(emotion) {

			this.collection.reset(superset.toJSON());
			if (emotion === 'all') {
				$('#memories_qty_label_prefix').text('');
				this.render();
				return;
			}
			var filtered = this.collection.filter(function(memory) {
				return (memory.get('emotions')[emotion]['value'] > 0);
			});
			$('#memories_qty_label_prefix').text( emotion_translate(emotion, 'adjective') );
			this.collection.reset(filtered);
			this.sort_by_emotion(emotion);
		},
		/* todo: filter by date - month/year/range/day of week */
	});
	var memories = new Memories_View(my_memory);





	/* --------------------------------------------------------------------------- */
	/* Extra Functions */

	// Sum all values (that are numbers) in an object
	function sum_obj_values(obj) {
		var sum = 0;
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop))
				sum += obj[prop];
		}
		return sum;
	}



	function emotion_translate(emotion, flag) {
		/* 
			emotion => flag
			flags:
			'color' returns corresponding hex value
			'adjective' returns corresponding adjective
		*/
		switch (emotion) {
			case 'joy':
				return flag === 'color' ? '#F5F317' : 'happy';
				break;
			case 'sadness':
				return flag === 'color' ? '#5380be' : 'sad';
				break;
			case 'anger':
				return flag === 'color' ? '#db373e' : 'angry';
				break;
			case 'fear':
				return flag === 'color' ? '#c3648e' : 'scary';
				break;
			case 'disgust':
				return flag === 'color' ? '#73c557' : 'disgusting';
				break;
			case 'neutral':
				return flag === 'color' ? '#ddd' : 'neutral';
				break;																		
		}		
	}



	/* Utility Functions */
	function display_noty(type, location, msg) {
		var n = noty({
			type: type,
			layout: location,
			text: msg,
			timeout: 2000,
			modal: false,
			maxVisible: 5,
			closeWith: ['click']
		});
	}
	/*
		types: alert, success, error, warning, information, confirm
		layouts: top, topLeft, topCenter, topRight, centerLeft, center, centerRight, bottomLeft, bottomCenter, bottomRight, bottom
	*/

})();


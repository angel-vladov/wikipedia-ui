// Българска версия на скрипта Advisor.js,
// копирана тук от Потребител:Cameltrader/Advisor.js
// виж http://en.wikipedia.org/wiki/User:Cameltrader/Advisor.js/Description

document.write('<script type="text/javascript" src="'
             + 'http://en.wikipedia.org/w/index.php?title=User:Cameltrader/Advisor.js'
             + '&action=raw&ctype=text/javascript&dontcountme=s"></script>');


var ct = ct || {};

if (window.wgUserLanguage === 'bg') {
	ct.translation = {
	
'Changing text in wikEd is not yet supported.':
	'Променянето на текст в wikEd още не се поддържа.',

'This article is rather long.  Advisor.js may consume a lot of RAM and CPU resources while trying to parse the text.  You could limit your edit to a single section, or ':
	'',

'scan the text anyway.':
	'',

'Ignore this warning.':
	'',

'Advisor.js is disabled on talk pages, because it might suggest changing other users\' comments.  That would be something against talk page conventions.  If you promise to be careful, you can ':
	'Advisor.js по подразбиране е спрян за беседите, защото има опасност да предложи промяна на чужди коментари.  Това би било в противоречие с конвенциите за беседи.  Ако обещаваш да си внимателен, можеш да ',

'scan the text anyway.':
	'провериш текста.',

'Ignore this warning.':
	'Игнорирай това предупреждение.',

'OK \u2014 Advisor.js found no issues with the text.':
	'ОК \u2014 Advisor.js не намира проблеми в текста.',

'1 suggestion: ':
	'1 предложение: ',

'$1 suggestions: ':
	'$1 предложения: ',

'fix':
	'поправи',

'Show All':
	'Покажи всички',

'formatting: $1 (using [[User:Cameltrader#Advisor.js|Advisor.js]])':
	'форматиране: $1 (ползвайки [[User:Cameltrader#Advisor.js|Advisor.js]])',

'Add to summary':
	'Добави към резюмето',

'Append the proposed summary to the input field below':
	'Добави предложеното резюме към полето отдолу',

'Error: If the proposed text is added to the summary, its length will exceed the $1-character maximum by $2 characters.':
	'Ако предложеният текст бъде добавен към резюмето, дължината му ще прехвърли ограничението от $1 символа с $2.',

'':''
	};
}


if (window.wgContentLanguage === 'bg') {

ct.rules = [];

ct.rules.push(function (s) {
	var re = /\[\[([{letter} ,\(\)\-]+)\|\1\]\]/g;
	re = ct.fixRegExp(re);
	var a = ct.getAllMatches(re, s);
	for (var i = 0; i < a.length; i++) {
		var m = a[i];
		a[i] = {
				start: m.start,
				end: m.end,
				replacement: '[[' + m[1] + ']]',
				name: 'А|А',
				description: '„[[А|А]]“ може да се опрости до „[[А]]“.',
				help: 'Синтаксисът на МедияУики позволява препратки от вида „<tt>[[А|А]]</tt>“ да се пишат просто като „<tt>[[А]]</tt>“.'
		};
	}
	return a;
});

ct.rules.push(function (s) {
	var re = /\[\[([{letter} ,\(\)\-]+)\|\1([{letter}]+)\]\]/g;
	re = ct.fixRegExp(re);
	var a = ct.getAllMatches(re, s);
	for (var i = 0; i < a.length; i++) {
		var m = a[i];
		a[i] = {
				start: m.start,
				end: m.end,
				replacement: '[[' + m[1] + ']]' + m[2],
				name: 'А|АБ',
				description: '„[[А|АБ]]“ може да се опрости до „[[А]]Б“.',
				help: 'Синтаксисът на МедияУики позволява препратки от вида „<tt>[[А|АБ]]</tt>“ да се пишат като „<tt>[[А]]Б</tt>“.'
		};
	}
	return a;
});

ct.rules.push(function (s) {
	var a = ct.getAllMatches(/ +$/gm, s);
	var b = [];
	for (var i = 0; i < a.length; i++) {
		var m = a[i];
		if (/^[=\|]$/.test(s[m.start - 1])) { // this can be tolerated, it happens too often in templates
			continue;
		}
		b.push({
				start: m.start,
				end: m.end,
				replacement: '',
				name: 'интервали',
				description: 'Изтрий интервалите в края на реда',
				help: 'Интервалите в края на реда са ненужни.'
		});
	}
	return b;
});

ct.rules.push(function (s) {
	var re = /[{letter}]( +- +)[{letter}]/g;
	re = ct.fixRegExp(re);
	var a = ct.getAllMatches(re, s);
	var b = [];
	for (var i = 0; i < a.length; i++) {
		var m = a[i];
		// Be careful not to break wikilinks.  If we find a ']' before we find an '['---drop the suggestion.
		var rightContext = s.substring(m.end);
		var indexOfOpening = rightContext.indexOf('[');
		var indexOfClosing = rightContext.indexOf(']');
		if ((indexOfClosing != -1)
				&& ((indexOfOpening == -1) || (indexOfOpening > indexOfClosing))) {
			continue;
		}
		b.push({
				start: m.start + 1,
				end: m.end - 1,
				replacement: '&nbsp;\u2014 ', // U+2014 is an mdash
				name: 'дълго тире',
				description: 'Смени с дълго тире (em dash)',
				help: 'В изречение, късо тире оградено с интервали, почти сигурно трябва да е дълго тире (em dash).'
		});
	}
	return b;
});

ct.rules.push(function (s) {
	var re = /[^0-9]({year}) *(?:-|\u2014|&mdash;|--) *({year})[^0-9]/g; // U+2014 is an mdash
	var a = ct.getAllMatches(re, s);
	for (var i = 0; i < a.length; i++) {
		var m = a[i];
		a[i] = {
				start: m.start + 1,
				end: m.end - 1,
				replacement: m[1] + '\u2013' + m[2], // U+2013 is an ndash
				name: 'средно тире',
				description: 'Периодите от години изглеждат по добре със средно тире (en dash).'
		};
	}
	return a;
});

ct.rules.push(function (s) {
	var re = /^(?: *)(==+)( *)([^=]*[^= ])( *)\1/gm;
	var a = ct.getAllMatches(re, s);
	var b = [];
	var level = 0; // == Level 1 ==, === Level 2 ===, ==== Level 3 ====, etc.
	var editform = document.getElementById('editform');
	// If we are editing a section, we have to be tolerant to the first heading's level
	var isSection = editform &&
	                (editform['wpSection'] != null) &&
	                (editform['wpSection'].value != '');
	// Count spaced and non-spaced headings to find out the majority
	var counters = {spaced: 0, nonSpaced: 0, unclear: 0};
	for (var i = 0; i < a.length; i++) {
		var m = a[i];
		counters[(!m[2] && !m[4]) ? 'nonSpaced' : (m[2] && m[4]) ? 'spaced' : 'unclear']++;
	}
	var predominantSpacingStyle = 'unclear';
	var total = counters.spaced + counters.nonSpaced;
	var threshold = 0.7;
	if (total >= 3) { // minimum number of headings required for us to judge
		if (counters.spaced >= threshold * total) {
			predominantSpacingStyle = 'spaced';
		} else if (counters.nonSpaced >= threshold * total) {
			predominantSpacingStyle = 'nonSpaced';
		}
	}
	var titleSet = {}; // a set of title names, will be used to detect duplicates
	for (var i = 0; i < a.length; i++) {
		var m = a[i];
		if (m[2] != m[4]) {
			var spacer = (predominantSpacingStyle == 'spaced') ? ' ' : (predominantSpacingStyle == 'nonSpaced') ? '' : m[2];
			b.push({
					start: m.start,
					end: m.end,
					replacement: m[1] + spacer + m[3] + spacer + m[1],
					name: 'заглавие',
					description: 'Поправи интервалите',
					help: 'Стилът на заглавието трябва да е или '
						+ "<tt>==&nbsp;С интервали&nbsp;==</tt>, или <tt>==Без интервали==</tt>."
			});
		} else if ((m[2] && (predominantSpacingStyle == 'nonSpaced'))
		       || (!m[2] && (predominantSpacingStyle == 'spaced'))) {
			var spacer = (m[2]) ? '' : ' ';
			b.push({
					start: m.start,
					end: m.end,
					replacement: m[1] + spacer + m[3] + spacer + m[1],
					name: 'заглавие-стил',
					description: 'Съобрази се с това, че повечето заглавия в тази статия са '
						+ ((m[2]) ? 'без' : 'с') + ' интервали',
					help: 'Има два стила на писане на заглавия в уики-текста: <tt><ul><li>== С интервали ==</li><li>==Без интервали==</li></ul>'
						+ 'Повечето заглавия в тази статия са '
						+ ((m[2]) ? 'без' : 'със')
						+ ' (' + counters.spaced + ' срещу ' + counters.nonSpaced + ').  '
						+ 'Препоръчва се да се съобразиш с мнозинството.'
			});
		}
		var oldLevel = level;
		level = m[1].length - 1;
		if ( (level - oldLevel > 1) && (!isSection || (oldLevel > 0)) ) {
			var h = '======='.substring(0, oldLevel + 2);
			b.push({
					start: m.start,
					end: m.end,
					replacement: h + m[2] + m[3] + m[2] + h,
					name: 'заглавие-вложеност',
					description: 'Поправи неправилната вложеност',
					help: 'Всяко заглавие трябва да е вложено точно едно ниво под по-общото заглавие.'
			});
		}
		var frequentMistakes = [
//				{ code: 'see-also',  wrong: /^see *al+so$/i,          correct: 'See also' },
//				{ code: 'ext-links', wrong: /^external links?$/i,     correct: 'External links' },
//				{ code: 'refs',      wrong: /^ref+e?r+en(c|s)es?$/i,  correct: 'References' }
		];
		for (var j = 0; j < frequentMistakes.length; j++) {
			var fm = frequentMistakes[j];
			if (fm.wrong.test(m[3]) && (m[3] != fm.correct)) {
				var r = m[1] + m[2] + fm.correct + m[2] + m[1];
				if (r != m[0]) {
					b.push({
							start: m.start,
							end: m.end,
							replacement: r,
							name: fm.code,
							description: 'Поправи на „' + fm.correct + "“.",
							help: 'Правилното изписване е „<tt>' + fm.correct + "</tt>“."
					});
				}
			}
		}
		if (titleSet[m[3]] != null) {
			b.push({
					start: m.start + (m[1] || '').length + (m[2] || '').length,
					end: m.start + (m[1] || '').length + (m[2] || '').length + m[3].length,
					replacement: null, // we cannot propose anything, it's the editor who has to choose a different title
					name: 'повторено заглавие',
					description: 'Повтарящите се заглавия трябва да се избягват',
					help: 'Имената на секциите трябва да са уникални в рамките на статията.'
			});
		}
		titleSet[m[3]] = true;
	}
	return b;
});

ct.rules.push(function (s) {
	// ISBN: ten or thirteen digits, each digit optionally followed by a hyphen, the last digit can be 'X' or 'x'
	var a = ct.getAllMatches(/ISBN *=? *(([0-9Xx]-?)+)/gi, s);
	var b = [];
	for (var i = 0; i < a.length; i++) {
		var m = a[i];
		var s = m[1].replace(/[^0-9Xx]+/g, '').toUpperCase(); // remove all non-digits
		if ((s.length !== 10) && (s.length !== 13)) {
			b.push({
					start: m.start,
					end: m.end,
					name: 'ISBN',
					description: 'Трябва да е дълъг 10 или 13 цифри',
					help: 'ISBN номерата трябва да са дълги 10 или 13 цифри.  '
							+ 'Този се състои от ' + s.length + ' цифри:<br><tt>' + m[1] + '</tt>'
			});
			continue;
		}
		var isNew = (s.length === 13); // old (10 digits) or new (13 digits)
		var xIndex = s.indexOf('X');
		if ((xIndex !== -1) && ((xIndex !== 9) || isNew)) {
			b.push({
					start: m.start,
					end: m.end,
					name: 'ISBN',
					description: 'Неправилна употреба на X като цифра',
					help: "``<tt>X</tt>'' може да се ползва само като последна цифра в в 10-цифрен ISBN номер "
							+ '<br><tt>' + m[1] + '</tt>'
			});
			continue;
		}
		var computedChecksum = 0;
		var modulus = (isNew) ? 10 : 11;
		for (var j = s.length - 2; j >= 0; j--) {
			var digit = s.charCodeAt(j) - 48; // 48 is the ASCII code of '0'
			var quotient = (isNew)
								? ((j & 1) ? 3 : 1) // the new way: 1 for even, 3 for odd
								: (10 - j);         // the old way: 10, 9, 8, etc
			computedChecksum = (computedChecksum + (quotient * digit)) % modulus;
		}
		computedChecksum = (modulus - computedChecksum) % modulus;
		var c = s.charCodeAt(s.length - 1) - 48;
		var actualChecksum = ((c < 0) || (9 < c)) ? 10 : c;
		if (computedChecksum === actualChecksum) {
			continue;
		}
		b.push({
				start: m.start,
				end: m.end,
				name: 'ISBN',
				description: 'Неправилна контролна сума',
				help: 'Неправилна контролна сума на ISBN номер:<br/><tt>' + m[1] + '</tt><br/>'
		});
	}
	return b;
});

ct.rules.push(function (s) {
	var re = /([{letter}]|&#768;|&#x0?300;|\u0300)+/g;
	re = ct.fixRegExp(re);
	var a = ct.getAllMatches(re, s);
	var b = [];
	for (var i = 0; i < a.length; i++) {
		var m = a[i];
		var w = m[0]; // the word
		if (w === 'й') {
			b.push({
					start: m.start,
					end: m.end,
					replacement: 'и&#768;',
					name: 'й→и\u0300',
					description: 'Промени „й“ на „и\u0300“',
					help: 'Когато се ползва като местоимение, „й“ трябва да се изписва '
							+ 'като „и&#x0300;“ с ударение.  В уикитекста това може да се направи чрез '
							+ '<tt>и&amp;#x0300;</tt> или <tt>и&amp;#768;</tt>.'
			});
		} else {
			// todo: check spelling
		}
	}
	return b;
});

ct.rules.push(function (s) {
	// год. предшествано от цифри, евентуално оградени с [[ и ]]
	var re = /((\[\[[0-9]+\]\]|[0-9]+)( +|&nbsp;)?)\u0433\u043e\u0434\./g;
	var a = ct.getAllMatches(re, s);
	var b = [];
	for (var i = 0; i < a.length; i++) {
		var m = a[i];
		var original = m[0];
		var replacement = m[1] + 'г.';
		if (original !== replacement) {
			b.push({
					start: m.start,
					end: m.end,
					replacement: replacement,
					name: 'год.→г.',
					description: 'год.→г.',
					help: 'Приетото съкращение за година е „г.“, а не „год.“'
			});
		}
	}
	return b;
});

ct.rules.push(function (s) {
	// год., лв. или щ.д.
	var re = /(\[\[[0-9]+\]\]|[0-9]+)( +|&nbsp;)?(\u0433\.|\u043b\u0432\.|\u0449\.\u0434\.)/g;
	var a = ct.getAllMatches(re, s);
	var b = [];
	for (var i = 0; i < a.length; i++) {
		var m = a[i];
		var number = m[1]; // може да е оградено с [[ и ]]
		var spacing = m[2] || '';
		var unit = m[3];
		if ((spacing !== ' ') && (spacing !== '&nbsp;')) {
			b.push({
					start: m.start,
					end: m.end,
					replacement: number + '&nbsp;' + unit,
					name: 'число+' + unit,
					description: 'год.→г.',
					help: 'Между число и „' + unit + '“ трябва да се оставя един интервал, '
							+ 'за предпочитане непренасящият се <tt>&amp;nbsp;</tt> '
							+ '(non-breaking space, <tt>U+00A0</tt>).'
			});
		}
	}
	return b;
});

}
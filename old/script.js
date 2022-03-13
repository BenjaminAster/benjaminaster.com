

let userLang;

if (localStorage.getItem("lang")) {
	userLang = localStorage.getItem("lang");
} else {
	userLang = navigator.language.toLowerCase();
	if (userLang == "de" || userLang == "de-de" || userLang == "de-at" || userLang == "de-ch") {
		userLang = "de";
	} else {
		userLang = "en";
	}
	localStorage.setItem("lang", userLang);
}
languageSelect.value = userLang;

function changeLang(data) {
	Object.keys(data).map(key => {
		if (data[key]["en"]) {
			// @ts-ignore
			$(`#${key}`).html(data[key][userLang]);
		} else {
			changeLang(data[key]);
		}
	})
}

let languageJSON;
// @ts-ignore
$.get("langs.json", (data) => {
	languageJSON = data;
	changeLang(languageJSON);
});

languageSelect.onchange = function () {
	userLang = languageSelect.value;
	localStorage.setItem("lang", userLang);
	changeLang(languageJSON)
}

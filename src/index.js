import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import common_br from "./translations/br/common.json";
import common_en from "./translations/en/common.json";
import SearchAlbums from './components/SearchAlbums';
import './css/style.css'

i18next.init({
	interpolation: { escapeValue: false },
	lng: 'br',
	resources: {
		en: {
			common: common_en
		},
		br: {
			common: common_br
		},
	},
});


class Main extends React.Component {

	render() {
		return (
			<I18nextProvider i18n={i18next}>
				<SearchAlbums />
			</I18nextProvider>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
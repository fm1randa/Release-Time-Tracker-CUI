import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "@atlaskit/css-reset";
import { ConfigurationModal } from "./components/configuration-modal";

const queryClient = new QueryClient();

ReactDOM.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
			<ConfigurationModal />
		</QueryClientProvider>
	</React.StrictMode>,
	document.getElementById("root"),
);

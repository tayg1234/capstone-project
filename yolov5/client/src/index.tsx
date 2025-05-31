import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import App from "./App"
import "./index.css"
import { ThemeProvider } from "./components/theme-provider"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)

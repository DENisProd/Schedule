import { Component } from "react";
import axios from "axios";
import {URLS} from "./urlsUtils";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service like AppSignal
        // logErrorToMyService(error, errorInfo);
    }

    render() {
        const { hasError, error } = this.state;

        if (hasError) {
            // You can render any custom fallback UI
            const favorites = localStorage.getItem('favorites')
            const myGroup = localStorage.getItem('my-group')
            const searchList = localStorage.getItem('searchList')
            const groupId = localStorage.getItem('groupId')
            const version = localStorage.getItem('version')
            const location = window.location.href

            const data = {
                location,
                favorites,
                myGroup,
                searchList,
                groupId,
                version,
                message: error
            }

            axios.post(URLS.ERRORS_LOG, data).then(res => console.log(res))

            return <ErrorFallback error={error} />;
        }

        return this.props.children;
    }
}

const ErrorFallback = ({ error }) => (
    <div>
        <p>Что-то пошло не так 😭</p>
        <p>Отправьте скриншот в сообщения группы ВК</p>

        {error.message && <span>Here's the error: {error.message}</span>}
    </div>
);

const errorBoundary = (WrappedComponent) => {
    return class extends ErrorBoundary {
        render() {
            const { hasError, error } = this.state;


            if (hasError) {
                // You can render any custom fallback UI
                return <ErrorFallback error={error} />;
            }

            return <WrappedComponent {...this.props} />;
        }
    };
};

export { errorBoundary };
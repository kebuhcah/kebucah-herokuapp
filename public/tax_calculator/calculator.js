'use strict';

const el = React.createElement;

function dollar(x) {
    return "$" + x.toLocaleString('en-US');
}

class TaxApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 25,
            text: '25'
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return el("div", null, el("h3", null, "Transfer Tax Calculator"),
            el("form", {
                    onSubmit: this.handleSubmit
                }, el("label", {
                    htmlFor: "new-todo"
                }, "Taxes on a residential property sold for..."),
                el("div", {
                        className: "input-group"
                    },
                    el("div", {
                            className: "input-group-prepend"
                        },
                        el("span", {
                            className: "input-group-text"
                        }, "$")),
                    el("input", {
                        id: "new-todo",
                        onChange: this.handleChange,
                        value: this.state.text,
                        type: "number",
                        min: 0,
                        step: 0.01
                    }),
                    el("div", {
                            className: "input-group-append"
                        },
                        el("span", {
                            className: "input-group-text"
                        }, "million"),
                        el("button", {
                            className: "btn btn-primary"
                        }, "Calculate"))
                )),
            el(TaxCalculation, {
                value: this.state.value
            }));
    }

    handleChange(e) {
        this.setState({
            text: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.state.text.length) {
            return;
        }

        this.setState(state => ({
            text: this.state.text,
            value: parseFloat(this.state.text)
        }));
    }

}

class TaxCalculation extends React.Component {
    render() {
        var oldState = this.props.value * 4000;
        var newState = this.props.value * 6500;

        var oldCityPct = '(1% when < $0.5M)';
        var oldCityVal = this.props.value * 10000;

        if (this.props.value >= 0.5) {
            oldCityPct = '(1.425% when >= $0.5M)';
            oldCityVal = this.props.value * 14250;
        }

        var oldMansionPct = '(none when < $1M)';
        var oldMansionVal = 0;

        if (this.props.value >= 1) {
            oldMansionPct = '(1% when >= $1M)';
            oldMansionVal = this.props.value * 10000;
        }

        var mansionPct = '(none when < $2M)';
        var mansionVal = 0;

        if (this.props.value >= 25) {
            mansionPct = '(2.9% when >= $25M)';
            mansionVal = this.props.value * 29000;
        } else if (this.props.value >= 20) {
            mansionPct = '(2.75% when >= $20M and < $25M)';
            mansionVal = this.props.value * 27500;
        } else if (this.props.value >= 15) {
            mansionPct = '(2.5% when >= $15M and < $20M)';
            mansionVal = this.props.value * 25000;
        } else if (this.props.value >= 10) {
            mansionPct = '(2.25% when >= $10M and < $15M)';
            mansionVal = this.props.value * 22500;
        } else if (this.props.value >= 5) {
            mansionPct = '(1.25% when >= $5M and < $10M)';
            mansionVal = this.props.value * 12500;
        } else if (this.props.value >= 3) {
            mansionPct = '(0.5% when >= $3M and < $5M)';
            mansionVal = this.props.value * 5000;
        } else if (this.props.value >= 2) {
            mansionPct = '(0.25% when >= $2M and < $3M)';
            mansionVal = this.props.value * 2500;
        }

        return el("div", {
                className: "row"
            },
            el("div", {
                    className: "col col-6"
                },
                el("div", {
                        className: "card"
                    },
                    el("div", {
                        className: "card-header"
                    }, "Old Taxes"),
                    el("div", {
                            className: "card-body"
                        }, el("h6", {
                            className: "card-title"
                        }, "State Transfer Tax (0.4%)"),
                        el("p", {
                                className: "card-text"
                            },
                            dollar(oldState)),
                        el("h6", {
                            className: "card-title"
                        }, "City Transfer Tax " + oldCityPct),
                        el("p", {
                                className: "card-text"
                            },
                            dollar(oldCityVal)),
                        el("h6", {
                            className: "card-title"
                        }, "Old Mansion Tax " + oldMansionPct),
                        el("p", {
                                className: "card-text"
                            },
                            dollar(oldMansionVal))
                    ),
                    el("div", {
                        className: "card-footer"
                    }, "Total: " + dollar(oldState + oldCityVal + oldMansionVal)))),
            el("div", {
                    className: "col col-6"
                },
                el("div", {
                        className: "card"
                    },
                    el("div", {
                        className: "card-header"
                    }, "New Taxes"),
                    el("div", {
                            className: "card-body"
                        }, el("h6", {
                            className: "card-title"
                        }, "State Transfer Tax (0.65%)"),
                        el("p", {
                                className: "card-text"
                            },
                            dollar(newState)),
                        el("h6", {
                            className: "card-title"
                        }, "City Transfer Tax " + oldCityPct),
                        el("p", {
                                className: "card-text"
                            },
                            dollar(oldCityVal)),
                        el("h6", {
                            className: "card-title"
                        }, "Old Mansion Tax " + oldMansionPct),
                        el("p", {
                                className: "card-text"
                            },
                            dollar(oldMansionVal)),
                        el("h6", {
                            className: "card-title"
                        }, "New Mansion Tax " + mansionPct),
                        el("p", {
                                className: "card-text"
                            },
                            dollar(mansionVal))
                    ),
                    el("div", {
                        className: "card-footer"
                    }, "Total: " + dollar(newState + oldCityVal + oldMansionVal + mansionVal))))
        );
    }

}

const domContainer = document.querySelector('#calculator_container');
ReactDOM.render(el(TaxApp), domContainer);

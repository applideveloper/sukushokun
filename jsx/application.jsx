var App = React.createClass({
  getInitialState: function() {
    return {
      screenshots: [],
      loading:     false,
      url:         null
    };
  },
  takeScreenShot: function() {
    if (!this.state.url) {
      window.alert('URLを入力してね');
      return;
    }

    this.setState({ loading: true });

    var request = '/screenshot?url=' + encodeURIComponent(this.state.url);
    // if ($('#is-mobile').prop('checked')) {
    //   request += '&mobile=true';
    // }    

    // FIXME: get rid of jQuery
    $.ajax({
      url: request
    }).done(function(data) {
      var screenshot = { id:3, data:data };
      this.setState({
        screenshots: [screenshot].concat(this.state.screenshots),
        loading:     false
      });
    }.bind(this)).fail(function(data) {
      this.setState({ loading: false });
    });
  },
  handleUrl: function(value) {
    this.setState({ url: value });
  },
  render: function() {
    return (
      <div>
        <h1>スクショ撮る君</h1>
        <Form onSubmit={this.takeScreenShot} onUrlChange={this.handleUrl}  />
        <Indicator loading={this.state.loading} />
        <ScreenShotList screenshots={this.state.screenshots} />
      </div>
    );
  }
});

var Form = React.createClass({
  propTypes: {
    onUrlChange: React.PropTypes.func.isRequired,
    onSubmit:    React.PropTypes.func.isRequired,
  },
  handleUrlChange: function(e) {
    this.props.onUrlChange(e.target.value);
  },
  handleButton: function() {
    this.props.onSubmit();
  },
  render: function() {
    return (
      <div>
        <input id="url" type="text" placeholder="http://" onChange={this.handleUrlChange} />
        <button id="btn-screenshot" onClick={this.handleButton}>撮る</button>
      </div>
    );
  }
});

var Indicator = React.createClass({
  propTypes: {
    loading: React.PropTypes.bool.isRequired
  },
  render: function() {
    if (this.props.loading) {
      return(      
        <span><img id="indicator" src="/images/ajax-loader.gif" /></span>
      );
    } else {
      return (
        <span></span>
      );
    }
  }
});

var ScreenShotList = React.createClass({
  render: function() {
    var screenshots = this.props.screenshots.map(function (screenshot) {
      return (
        <ScreenShot screenshot={screenshot} key={screenshot.id} />
      );
    }.bind(this));
    return (
      <div id="result">{screenshots}</div>
    );
  }
});

var ScreenShot = React.createClass({
  propTYpes: {
    screenshot: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      data: React.PropTypes.string.isRequired
    })
  },
  render: function() {
    var src = "data:image/png;base64," + this.props.screenshot.data;
    return (
      <img src={src} />
    );
  }
});

React.render(
  <App />,
  document.getElementById('app-container')
);

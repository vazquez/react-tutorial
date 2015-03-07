// Creating a component for CommentList
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
    return (
      <Comment author={comment.author}>
        {comment.text}
      </Comment>
    );
    });
    // component has HTML, which you write in the return statement
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

// Creating component for CommentForm
var CommentForm = React.createClass({
  handleSubmit: function(e){
    // Let's make the form interactive. When the user submits the form, we should clear it, submit a request to the server, and refresh the list of comments. To start, let's listen for the form's submit event and clear it.
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if(!text || !author){
      console.log("No data");
      return;
    }
    this.props.onCommentSubmit({ author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
  },
  render: function() {
    return (
      // component has HTML, which you write in the return statement
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something" ref="text"/>
        <input type="submit" value="Post Comment" />
      </form>
    );
  }
});

// Creating a component called CommentBox
var CommentBox = React.createClass({
loadCommentsFromServer: function() {
$.ajax({
  url: this.props.url,
  dataType: 'json',
  success: function(data) {
    this.setState({data: data});
  }.bind(this),
  error: function(xhr, status, err) {
    console.error(this.props.url, status, err.toString());
  }.bind(this)
  });
},
//submit to the server and refresh the list:
handleCommentSubmit: function(comment) {
  $.ajax({
    url: this.props.url,
    dataType: 'json',
    type: 'POST',
    data: comment,
    success: function(data) {
      this.setState({data: data});
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  });
},
getInitialState: function() {
  return {data: []};
},
componentDidMount: function() {
  this.loadCommentsFromServer();
  setInterval(this.loadCommentsFromServer, this.props.pollInterval);
},
render: function() {
  return (
    <div className="commentBox">
      <h1>Comments</h1>
      <CommentList data={this.state.data} />
      <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
    </div>
  );// ends return
 } // ends render function
}); //ends createClass

// Creating a component called Comment. Using 'props' we will be able to
// read the data passed to it from the CommentList, and render markup
var converter = new Showdown.converter(); // Showdown takes Markdown and converts to text
var Comment = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
    //  We need to convert this.props.children from React's wrapped text
    // to a raw string that Showdown will understand so we explicitly call
    // toString().
  }
});

// React.render() instantiates the root component, starts the framework, and injects the markup into a raw DOM element, provided as the second argument.
React.render(
  <CommentBox url="comments.json" pollInterval={2000} />,
  document.getElementById('content') //markup is injected here
);

// We pass some methods in a JavaScript object to React.createClass() to create a new React component. The most important of these methods is called render which returns a tree of React components that will eventually render to HTML.

//You do not have to return basic HTML. You can return a tree of components that you (or someone else) built. This is what makes React composable: a key tenet of maintainable frontends.
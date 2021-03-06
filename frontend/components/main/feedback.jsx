import React from 'react';

class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      activeInput: -1,
      errors: [],
      success: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal(evt) {
    this.setState({ showModal: !this.state.showModal });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const data = new FormData(evt.target); // this can be submitted directly to BE?
    // FormData.entries(), FormData.keys(), FormData.get("name"), FormData.set("name", value)
    const feedback = {};
    for (let [inputName, inputValue] of data.entries()) {
      feedback[inputName] = inputValue;
    }
    let that = this;
    this.createFeedback(feedback)
      .then(
        res => {
          console.log("Feedback submitted! Thank you!");
          that.setState({ success: true, errors: [], activeInput: -1 });
          // setTimeout(that.toggleModal, 5000);
        }, errors => {
          that.setState({ errors: errors.responseJSON })
        });
  }

  createFeedback(feedback) {
    console.log(`Submitting feedback...`);

    return $.ajax({
      url: `/api/feedback`,
      method: "POST",
      data: {
        feedback
      }
    })
  }

  handleFocus(inputId) {
    return (evt) => this.setState({ activeInput: inputId });
  }

  render() {
    const { showModal, activeInput, errors, success } = this.state;

    return (
      <>
        <div id="feedback-button" onClick={this.toggleModal}>Share Feedback <span>&#9787;</span></div>
        {showModal &&
          (
            <div className={`basic-modal-wrapper${showModal ? " show" : ""}`}>
              <div className="modal-backdrop"></div>
              <div id="feedback-modal-box">
                <div className="modal-close" onClick={this.toggleModal}></div>
                <h1><span>&#10023;</span> Feedback <span>&#10023;</span></h1>

                {success ? (
                  <div id="feedback-modal-success">
                    <div>
                      <h2> Thank you for taking the time to provide feedback! <span>&#9786;</span> </h2>
                      <button className={"feedback-modal-submit"} onClick={() => this.setState({ success: false })} type="button">Submit another entry?</button>
                    </div>
                  </div>
                ) :
                  (
                    <>
                    <h3>
                      Hey there, glad you could stop by! I'm constantly learning and would love to hear 
                      about where I can improve, or any bugs I may have missed. If you could take 
                      a moment to leave a little feedback or just to say hi, I would greatly appreciate it! 
                      Cheers 🍻
                     </h3>
                      <form id="feedback-modal-form" onSubmit={this.handleSubmit}>
                        <label htmlFor="feedback-modal-form-1" className={activeInput === 1 ? "label-input-focused" : undefined} >
                          1-3 Potential Improvements:</label>
                        <textarea id="feedback-modal-form-1" type="text" name="improvements" onFocus={this.handleFocus(1)} />
                        <label htmlFor="feedback-modal-form-2" className={activeInput === 2 ? "label-input-focused" : undefined} >
                          Likes/Dislikes, Angry Messages, or Other Comments (opt.):</label>
                        <textarea id="feedback-modal-form-2" type="text" name="other_comments" onFocus={this.handleFocus(2)} />
                        <label htmlFor="feedback-modal-form-3" className={activeInput === 3 ? "label-input-focused" : undefined} >
                          Name (opt.):</label>
                        <input id="feedback-modal-form-3" type="text" name="name" onFocus={this.handleFocus(3)} />
                        {/* <label htmlFor="feedback-modal-form-4" className={activeInput === 4 ? "label-input-focused" : undefined} >
                    Other Comments:</label>
                  <textarea id="feedback-modal-form-4" type="text" name="other" onFocus={this.handleFocus(4)} /> */}
                        <button className="feedback-modal-submit">Submit Feedback</button>
                      </form>
                      <div className="feedback-errors">{errors.join(", ")}</div>
                    </>
                  )}
              </div>
            </div>
          )
        }
      </>
    )
  }
}

export default Feedback;
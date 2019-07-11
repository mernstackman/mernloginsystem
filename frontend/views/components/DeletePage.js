import React from "react";

function DeletePage() {
  useEffect(() => {
    document.title = this.props.title;
  });

  return (
    <div>
      <h1>Your account has been deleted!</h1>
    </div>
  );
}

export default DeletePage;

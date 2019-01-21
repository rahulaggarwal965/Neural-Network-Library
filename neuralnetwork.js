class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

let tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y),
)

let reLU = new ActivationFunction(
  x => Math.max(0, x),
  y => (y < 0) ? 0 : 1
)


class NeuralNetwork {
  constructor(in_ns, hid_ns, out_ns) {
    if (in_ns instanceof NeuralNetwork) {

      //Get Neural Network Parameters
      this.in_ns = in_ns.in_ns;
      this.hid_ns = in_ns.hid_ns;
      this.out_ns = in_ns.out_ns;

      //Copy Weight and Bias Array-Matrices
      this.weights = new Array(in_ns.weights.length).fill().map((el, i) => in_ns.weights[i].copy());
      this.biases = new Array(in_ns.biases.length).fill().map((el, i) => in_ns.biases[i].copy());

    } else {

      //Get Neural Network Parameters
      this.in_ns = in_ns;
      this.hid_ns = hid_ns;
      this.out_ns = out_ns;

      //Create weights array between layers
      this.weights = new Array(this.hid_ns.length + 1);

      //Create the first and last matrices with random normalized weights
      this.weights[0] = new Matrix(this.hid_ns[0], this.in_ns);
      this.weights[0].randomize();
      this.weights[this.weights.length - 1] = new Matrix(this.out_ns, this.hid_ns[this.hid_ns.length - 1])
      this.weights[this.weights.length - 1].randomize();

      //Create the rest of the matrices between the hidden laters again with random normalized weights
      for (let i = 1; i < this.weights.length - 1; i++) {
        this.weights[i] = new Matrix(this.hid_ns[i], this.hid_ns[i-1]);
        this.weights[i].randomize();
      }

      //Create biases array between layers
      this.biases = new Array(this.hid_ns.length + 1);

      //Create the first and last matrices with random normalized biases
      this.biases[0] = new Matrix(this.hid_ns[0], 1);
      this.biases[0].randomize();
      this.biases[this.biases.length - 1] = new Matrix(this.out_ns, 1)
      this.biases[this.biases.length - 1].randomize();

      //Create the rest of the matrices between the hidden laters again with random normalized biases
      //Note: This process could be optimized by relegating the initialization of biases into the initialization, but this is omitted for code clarity
      for (let i = 1; i < this.biases.length - 1; i++) {
        this.biases[i] = new Matrix(this.hid_ns[i], 1);
        this.biases[i].randomize();
      }
    }

    //Set both the learning rate and the activation function
    //TODO: allow more activation functions and implement multiple cost functions
    this.setLearningRate();
    this.setActivationFunction();
  }

  predict(in_arr) {

    //Get inputs from an array
    let inputs = Matrix.fromArray(in_arr);

    //Calculate the normalized weighted sum of the first layer to the second
    let outputs = Matrix.multiply(this.weights[0], inputs);
    outputs.add(this.biases[0]);
    outputs.map(this.activation_function.func);

    //Traverse the network
    for (let i = 1; i < this.weights.length; i++) {
      outputs = Matrix.multiply(this.weights[i], outputs);
      outputs.add(this.biases[i]);
      outputs.map(this.activation_function.func);
    }

    //Return the outputs as an array
    return outputs.toArray();

  }

  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = learning_rate;
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }

  train(in_arr, targ_arr) {

    //Get inputs from an array
    let inputs = Matrix.fromArray(in_array);

    //Initialize an array for each of the output layers (all except for inputs)
    let outputs = new Array(this.hid_ns.length + 1);

    //Calculate the normalized weighted sum of the first layer to the second and record the first activation
    outputs[0] = Matrix.multiply(this.weights[0], inputs);
    outputs[0].add(this.biases[0]);
    outputs[0].map(this.activation_function.func)

    //Traverse the network and record each activation
    for (let i = 1; i < outputs.length; i++) {
      outputs[1] = Matrix.multiply(this.weights[i], outputs[i-1]);
      outputs.add(this.biases[i]);
      outputs.map(this.activation_function.func);
    }

    //Get target values from an array
    let targets = Matrix.fromArray(targ_arr);

    //Calculate Cost of the Neural Network using subtraction
    //TODO: Add different cost functions
    let output_errors = Matrix.subtract(targets, outputs[outputs.length - 1]);

    //Initialize an array for each of the gradients that will slightly change the weight and bias matrices
    let gradients = new Array(outputs.length);

    /*
    Using the derivative of the activation function, we will apply it recursively to see how slightly changing the weights
    and biases change how the outputs resolve. Essentially, this is the step where we calculate the direction to
    a local minima on an n-dimensional Cost manifold where n represents the number of parameters (sum total of weights and biases).
    Then using the errors, we take a step (with size depending on the learning rate) that is usally small in order to slowly come
    into that closest local minima.
    */
    gradients[gradients.length - 1] = Matrix.map(outputs[outputs.length - 1], this.activation_function.dfunc);
    gradients[gradients.length - 1].multiply(output_errors);
    gradients[gradients.length - 1].multiply(this.learning_rate);

    let transposed = Matrix.transpose(outputs[outputs.length - 2]);
    let weight


  //   let hiddenArr = [];
  //   let inputs = Matrix.fromArray(in_arr);
  //   let hidden = Matrix.multiply(this.weights_ih, inputs);
  //   hidden.add(this.bi_h[0]);
  //   hidden.map(this.activation_function.func);
  //   hiddenArr.pushk
  //
  //   for (let i = 0; i < this.hid_ns.length; i++) {
  //     hidden = Matrix.multiply(this.we_hh[i], hidden);
  //     hidden.add(this.bi_h[i+1]);
  //     hidden.map(this.activation_function.func);
  //   }
  //
  //   let outputs = Matrix.multiply(this.we_ho, hidden);
  //   outputs.add(this.bi_o);
  //   outputs.map(this.activation_function.func);
  //
  //   let targets = Matrix.fromArray(targ_arr);
  //
  //   //TODO: Make different cost functions, one below is sigma(t - o), or average difference
  //   let output_errors = Matrix.subtract(targets, outputs);
  //
  //   let gradients = Matrix.map(outputs, this.activation_function.dfunc);
  //   gradients.multiply(output_errors);
  //   gradients.multiply(this.learning_rate);
  //
  //   let hidden_T = Matrix.transpose(hidden);
  //   let we_ho_ds = Matrix.multiply(gradients, hidden_T);
  //
  //   this.we_ho.add(we_ho_ds);
  //   this.bias_o.add(gradients);
  //
  //   let we_t;
  //   let hidden_errors;
  //   let hidden_gradients;
  //   for (let i = this.we_hh.length - 1; i >= 0; i--) {
  //     we_t = Matrix.transpose(this.we_hh[i]);
  //     hidden_errors = Matrix.multiply(we_t, hidden_errors);
  //
  //     hidden_gradient = Matrix.map(hidden)
  //   }
  //
  //
  // }

}

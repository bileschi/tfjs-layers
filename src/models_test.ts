/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */

// tslint:disable:max-line-length
import {Scalar, scalar, Tensor, zeros} from 'deeplearn';

import * as K from './backend/deeplearnjs_backend';
import {Dense, Reshape} from './layers/core';
import {modelFromJSON, Sequential} from './models';
import {describeMathCPU, describeMathCPUAndGPU, expectTensorsClose} from './utils/test_utils';

// tslint:enable:max-line-length

describeMathCPU('model_from_json', () => {
  const useJSONObjectValues = [false, true];
  for (const useJSONObject of useJSONObjectValues) {
    it(`reconstitutes pythonic json string: use JSON object: ${useJSONObject}`,
       () => {
         /* python generating code
           a=Input(shape=(32,))
           b=Dense(32)(a)
           model = Model(inputs=a, outputs=b, name="test")
           model.to_json())
           */
         const json = `{
          "class_name": "Model",
          "keras_version": "2.0.7",
          "config": {
            "layers": [
              {
                "class_name": "InputLayer",
                "config": {
                  "dtype": "float32",
                  "batch_input_shape": [
                    null,
                    32
                  ],
                  "name": "input_6",
                  "sparse": false
                },
                "inbound_nodes": [],
                "name": "input_6"
              },
              {
                "class_name": "Dense",
                "config": {
                  "units": 32,
                  "bias_constraint": null,
                  "use_bias": true,
                  "kernel_initializer": {
                    "class_name": "VarianceScaling",
                    "config": {
                      "distribution": "uniform",
                      "scale": 1,
                      "seed": null,
                      "mode": "fan_avg"
                    }
                  },
                  "activation": "linear",
                  "bias_regularizer": null,
                  "activity_regularizer": null,
                  "trainable": true,
                  "kernel_constraint": null,
                  "kernel_regularizer": null,
                  "name": "dense_6",
                  "bias_initializer": {
                    "class_name": "Zeros",
                    "config": {}
                  }
                },
                "inbound_nodes": [
                  [
                    [
                      "input_6",
                      0,
                      0,
                      {}
                    ]
                  ]
                ],
                "name": "dense_6"
              }
            ],
            "input_layers": [
              [
                "input_6",
                0,
                0
              ]
            ],
            "output_layers": [
              [
                "dense_6",
                0,
                0
              ]
            ],
            "name": "test"
          },
          "backend": "tensorflow"
        }`;
         const model = modelFromJSON(useJSONObject ? JSON.parse(json) : json);
         expect(model.name).toEqual('test');
         const allZeros = zeros([1, 32]);
         expectTensorsClose(model.apply(allZeros) as Tensor, allZeros);
       });
  }
  it('reconstitutes mnist non-sequential mode.', () => {
    /*
    input_shape = (28,28,1)
    num_classes=10

    input_layer= Input(shape=input_shape)
    layer1 = Conv2D(32, kernel_size=(3, 3),
                     activation='relu',
                     input_shape=input_shape)
    layer1_result = layer1(input_layer)
    layer2= Conv2D(64, (3,3), activation='relu')
    layer2_result = layer2(layer1_result)
    layer3 = MaxPooling2D(pool_size=(2, 2))
    layer3_result = layer3(layer2_result)
    layer4 = Dropout(0.25)
    layer4_result = layer4(layer3_result)
    layer5 = Flatten()
    layer5_result = layer5(layer4_result)
    layer6 = Dense(128, activation='relu')
    layer6_result = layer6(layer5_result)
    layer7=Dropout(0.5)
    layer7_result = layer7(layer6_result)
    layer8=Dense(num_classes, activation='softmax')
    layer8_result = layer8(layer7_result)
    model = Model(inputs=input_layer, outputs=layer8_result, name='mnist')
    model.to_json()
      */
    // tslint:disable:max-line-length
    const json =
        '{"backend": "tensorflow", "class_name": "Model", "keras_version": "2.1.1", "config": {"name": "mnist", "output_layers": [["dense_16", 0, 0]], "layers": [{"class_name": "InputLayer", "name": "input_6", "inbound_nodes": [], "config": {"batch_input_shape": [null, 28, 28, 1], "sparse": false, "name": "input_6", "dtype": "float32"}}, {"class_name": "Conv2D", "name": "conv2d_15", "inbound_nodes": [[["input_6", 0, 0, {}]]], "config": {"bias_initializer": {"class_name": "Zeros", "config": {}}, "padding": "valid", "use_bias": true, "strides": [1, 1], "bias_regularizer": null, "activity_regularizer": null, "kernel_initializer": {"class_name": "VarianceScaling", "config": {"distribution": "uniform", "scale": 1.0, "mode": "fan_avg", "seed": null}}, "data_format": "channels_last", "dilation_rate": [1, 1], "kernel_constraint": null, "kernel_regularizer": null, "kernel_size": [3, 3], "activation": "relu", "name": "conv2d_15", "filters": 32, "trainable": true, "bias_constraint": null}}, {"class_name": "Conv2D", "name": "conv2d_16", "inbound_nodes": [[["conv2d_15", 0, 0, {}]]], "config": {"bias_initializer": {"class_name": "Zeros", "config": {}}, "padding": "valid", "use_bias": true, "strides": [1, 1], "bias_regularizer": null, "activity_regularizer": null, "kernel_initializer": {"class_name": "VarianceScaling", "config": {"distribution": "uniform", "scale": 1.0, "mode": "fan_avg", "seed": null}}, "data_format": "channels_last", "dilation_rate": [1, 1], "kernel_constraint": null, "kernel_regularizer": null, "kernel_size": [3, 3], "activation": "relu", "name": "conv2d_16", "filters": 64, "trainable": true, "bias_constraint": null}}, {"class_name": "MaxPooling2D", "name": "max_pooling2d_8", "inbound_nodes": [[["conv2d_16", 0, 0, {}]]], "config": {"padding": "valid", "strides": [2, 2], "pool_size": [2, 2], "data_format": "channels_last", "name": "max_pooling2d_8", "trainable": true}}, {"class_name": "Dropout", "name": "dropout_15", "inbound_nodes": [[["max_pooling2d_8", 0, 0, {}]]], "config": {"rate": 0.25, "noise_shape": null, "name": "dropout_15", "trainable": true, "seed": null}}, {"class_name": "Flatten", "name": "flatten_8", "inbound_nodes": [[["dropout_15", 0, 0, {}]]], "config": {"name": "flatten_8", "trainable": true}}, {"class_name": "Dense", "name": "dense_15", "inbound_nodes": [[["flatten_8", 0, 0, {}]]], "config": {"use_bias": true, "bias_regularizer": null, "kernel_initializer": {"class_name": "VarianceScaling", "config": {"distribution": "uniform", "scale": 1.0, "mode": "fan_avg", "seed": null}}, "bias_initializer": {"class_name": "Zeros", "config": {}}, "kernel_constraint": null, "bias_constraint": null, "kernel_regularizer": null, "activation": "relu", "name": "dense_15", "activity_regularizer": null, "trainable": true, "units": 128}}, {"class_name": "Dropout", "name": "dropout_16", "inbound_nodes": [[["dense_15", 0, 0, {}]]], "config": {"rate": 0.5, "noise_shape": null, "name": "dropout_16", "trainable": true, "seed": null}}, {"class_name": "Dense", "name": "dense_16", "inbound_nodes": [[["dropout_16", 0, 0, {}]]], "config": {"use_bias": true, "bias_regularizer": null, "kernel_initializer": {"class_name": "VarianceScaling", "config": {"distribution": "uniform", "scale": 1.0, "mode": "fan_avg", "seed": null}}, "bias_initializer": {"class_name": "Zeros", "config": {}}, "kernel_constraint": null, "bias_constraint": null, "kernel_regularizer": null, "activation": "softmax", "name": "dense_16", "activity_regularizer": null, "trainable": true, "units": 10}}], "input_layers": [["input_6", 0, 0]]}}';
    // tslint:enable
    const model = modelFromJSON(json);
    expect(model.name).toEqual('mnist');
    expect(model.layers.length).toEqual(9);
    const prediction = model.predict(K.zeros([1, 28, 28, 1])) as Tensor;
    expect(prediction.shape).toEqual([1, 10]);
    expect(K.sum(prediction).dataSync()).toBeCloseTo(1);
  });
  it('reconstitutes mnist sequential mode.', () => {
    /*
    input_shape = (28,28,1)
    num_classes = 10

    model = Sequential()
    model.add(Conv2D(32, kernel_size=(3, 3),
                     activation='relu',
                     input_shape=input_shape))
    model.add(Conv2D(64, (3,3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))
    model.add(Flatten())
    model.add(Dense(128, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(num_classes, activation='softmax'))

    model.to_json())
    */
    // tslint:disable:max-line-length
    const json =
        '{"backend": "tensorflow", "config": [{"config": {"kernel_size": [3, 3], "use_bias": true, "batch_input_shape": [null, 28, 28, 1], "filters": 32, "kernel_regularizer": null, "dilation_rate": [1, 1], "strides": [1, 1], "padding": "valid", "bias_constraint": null, "kernel_constraint": null, "data_format": "channels_last", "trainable": true, "activation": "relu", "dtype": "float32", "bias_initializer": {"config": {}, "class_name": "Zeros"}, "bias_regularizer": null, "name": "conv2d_1", "kernel_initializer": {"config": {"scale": 1.0, "mode": "fan_avg", "seed": null, "distribution": "uniform"}, "class_name": "VarianceScaling"}, "activity_regularizer": null}, "class_name": "Conv2D"}, {"config": {"kernel_size": [3, 3], "use_bias": true, "filters": 64, "kernel_regularizer": null, "dilation_rate": [1, 1], "strides": [1, 1], "padding": "valid", "bias_constraint": null, "data_format": "channels_last", "trainable": true, "activation": "relu", "kernel_constraint": null, "bias_initializer": {"config": {}, "class_name": "Zeros"}, "bias_regularizer": null, "name": "conv2d_2", "kernel_initializer": {"config": {"scale": 1.0, "mode": "fan_avg", "seed": null, "distribution": "uniform"}, "class_name": "VarianceScaling"}, "activity_regularizer": null}, "class_name": "Conv2D"}, {"config": {"strides": [2, 2], "padding": "valid", "pool_size": [2, 2], "data_format": "channels_last", "trainable": true, "name": "max_pooling2d_1"}, "class_name": "MaxPooling2D"}, {"config": {"seed": null, "name": "dropout_1", "trainable": true, "noise_shape": null, "rate": 0.25}, "class_name": "Dropout"}, {"config": {"name": "flatten_1", "trainable": true}, "class_name": "Flatten"}, {"config": {"use_bias": true, "units": 128, "bias_initializer": {"config": {}, "class_name": "Zeros"}, "kernel_regularizer": null, "bias_regularizer": null, "trainable": true, "activation": "relu", "bias_constraint": null, "kernel_constraint": null, "name": "dense_1", "kernel_initializer": {"config": {"scale": 1.0, "mode": "fan_avg", "seed": null, "distribution": "uniform"}, "class_name": "VarianceScaling"}, "activity_regularizer": null}, "class_name": "Dense"}, {"config": {"seed": null, "name": "dropout_2", "trainable": true, "noise_shape": null, "rate": 0.5}, "class_name": "Dropout"}, {"config": {"use_bias": true, "units": 10, "bias_initializer": {"config": {}, "class_name": "Zeros"}, "kernel_regularizer": null, "bias_regularizer": null, "trainable": true, "activation": "softmax", "bias_constraint": null, "kernel_constraint": null, "name": "dense_2", "kernel_initializer": {"config": {"scale": 1.0, "mode": "fan_avg", "seed": null, "distribution": "uniform"}, "class_name": "VarianceScaling"}, "activity_regularizer": null}, "class_name": "Dense"}], "keras_version": "2.1.1", "class_name": "Sequential"}';
    // tslint:enable
    const model = modelFromJSON(json);
    expect(model.layers.length).toEqual(8);
    const prediction = model.predict(K.zeros([1, 28, 28, 1])) as Tensor;
    expect(prediction.shape).toEqual([1, 10]);
    expect(K.sum(prediction).dataSync()).toBeCloseTo(1);
  });
});

describeMathCPU('model_from_json', () => {
  it('Serialization round-tripping', () => {
    // tslint:disable:max-line-length
    const json =
        '{"backend": "tensorflow", "class_name": "Model", "keras_version": "2.1.1", "config": {"name": "mnist", "output_layers": [["dense_16", 0, 0]], "layers": [{"class_name": "InputLayer", "name": "input_6", "inbound_nodes": [], "config": {"batch_input_shape": [null, 28, 28, 1], "sparse": false, "name": "input_6", "dtype": "float32"}}, {"class_name": "Conv2D", "name": "conv2d_15", "inbound_nodes": [[["input_6", 0, 0, {}]]], "config": {"bias_initializer": {"class_name": "Zeros", "config": {}}, "padding": "valid", "use_bias": true, "strides": [1, 1], "bias_regularizer": null, "activity_regularizer": null, "kernel_initializer": {"class_name": "VarianceScaling", "config": {"distribution": "uniform", "scale": 1.0, "mode": "fan_avg", "seed": null}}, "data_format": "channels_last", "dilation_rate": [1, 1], "kernel_constraint": null, "kernel_regularizer": null, "kernel_size": [3, 3], "activation": "relu", "name": "conv2d_15", "filters": 32, "trainable": true, "bias_constraint": null}}, {"class_name": "Conv2D", "name": "conv2d_16", "inbound_nodes": [[["conv2d_15", 0, 0, {}]]], "config": {"bias_initializer": {"class_name": "Zeros", "config": {}}, "padding": "valid", "use_bias": true, "strides": [1, 1], "bias_regularizer": null, "activity_regularizer": null, "kernel_initializer": {"class_name": "VarianceScaling", "config": {"distribution": "uniform", "scale": 1.0, "mode": "fan_avg", "seed": null}}, "data_format": "channels_last", "dilation_rate": [1, 1], "kernel_constraint": null, "kernel_regularizer": null, "kernel_size": [3, 3], "activation": "relu", "name": "conv2d_16", "filters": 64, "trainable": true, "bias_constraint": null}}, {"class_name": "MaxPooling2D", "name": "max_pooling2d_8", "inbound_nodes": [[["conv2d_16", 0, 0, {}]]], "config": {"padding": "valid", "strides": [2, 2], "pool_size": [2, 2], "data_format": "channels_last", "name": "max_pooling2d_8", "trainable": true}}, {"class_name": "Dropout", "name": "dropout_15", "inbound_nodes": [[["max_pooling2d_8", 0, 0, {}]]], "config": {"rate": 0.25, "noise_shape": null, "name": "dropout_15", "trainable": true, "seed": null}}, {"class_name": "Flatten", "name": "flatten_8", "inbound_nodes": [[["dropout_15", 0, 0, {}]]], "config": {"name": "flatten_8", "trainable": true}}, {"class_name": "Dense", "name": "dense_15", "inbound_nodes": [[["flatten_8", 0, 0, {}]]], "config": {"use_bias": true, "bias_regularizer": null, "kernel_initializer": {"class_name": "VarianceScaling", "config": {"distribution": "uniform", "scale": 1.0, "mode": "fan_avg", "seed": null}}, "bias_initializer": {"class_name": "Zeros", "config": {}}, "kernel_constraint": null, "bias_constraint": null, "kernel_regularizer": null, "activation": "relu", "name": "dense_15", "activity_regularizer": null, "trainable": true, "units": 128}}, {"class_name": "Dropout", "name": "dropout_16", "inbound_nodes": [[["dense_15", 0, 0, {}]]], "config": {"rate": 0.5, "noise_shape": null, "name": "dropout_16", "trainable": true, "seed": null}}, {"class_name": "Dense", "name": "dense_16", "inbound_nodes": [[["dropout_16", 0, 0, {}]]], "config": {"use_bias": true, "bias_regularizer": null, "kernel_initializer": {"class_name": "VarianceScaling", "config": {"distribution": "uniform", "scale": 1.0, "mode": "fan_avg", "seed": null}}, "bias_initializer": {"class_name": "Zeros", "config": {}}, "kernel_constraint": null, "bias_constraint": null, "kernel_regularizer": null, "activation": "softmax", "name": "dense_16", "activity_regularizer": null, "trainable": true, "units": 10}}], "input_layers": [["input_6", 0, 0]]}}';
    // tslint:enable:max-line-length
    const origJson = JSON.parse(json);
    const model = modelFromJSON(json);
    const serializedModel = model.toJSON();
    const reparsedJson = JSON.parse(serializedModel);
    expect(reparsedJson['class_name']).toEqual(origJson['class_name']);
    // Intentionally skipping backend and keras_version fields.
    expect(reparsedJson['config']).toEqual(origJson['config']);
  });
});

describeMathCPUAndGPU('Sequential', () => {
  const inputShape = [1, 6];
  const batchInputShape = [1].concat(inputShape);
  const firstReshape = [2, 3];
  const secondReshape = [3, 2];
  const layers = [
    new Reshape({targetShape: firstReshape, batchInputShape, name: 'layer1'}),
    new Reshape({targetShape: secondReshape, name: 'layer2'})
  ];

  function getInputs(): Tensor {
    return K.ones(batchInputShape);
  }

  function getExpectedOutputs(): Tensor {
    return K.ones([1].concat(secondReshape));
  }

  it('throws an exception if the first layer is not an input layer', () => {
    const layer = new Reshape({targetShape: firstReshape});
    expect(() => new Sequential({layers: [layer]}))
        .toThrowError(
            /The first layer in a Sequential model must get an `inputShape`/);
  });

  it('can accept a list of layers in constructor', () => {
    const model = new Sequential({layers});
    expect(model.layers).toEqual(layers);
  });

  it('can add layers', () => {
    const model = new Sequential({});
    for (const layer of layers) {
      model.add(layer);
    }
    expect(model.layers).toEqual(layers);
  });

  it('can pop layers', () => {
    const model = new Sequential({layers});
    model.pop();
    expect(model.layers).toEqual(layers.slice(0, 1));
  });

  it('throws error if try to pop too many layers', () => {
    const model = new Sequential({});
    expect(() => model.pop()).toThrowError(/There are no layers in the model/);
  });

  it('apply() threads data through the model.', () => {
    const model = new Sequential({layers});
    expectTensorsClose(
        model.apply(getInputs()) as Tensor, getExpectedOutputs());
  });

  it('predict() threads data through the model.', () => {
    const model = new Sequential({layers});
    expectTensorsClose(
        model.predict(getInputs()) as Tensor, getExpectedOutputs());
  });

  it('predictOnBatch() threads data through the model.', () => {
    const batchSize = 10;
    const inputShape = [1, 6];
    const batchInputShape = [batchSize].concat(inputShape);
    const firstReshape = [2, 3];
    const secondReshape = [3, 2];
    const layers = [
      new Reshape({targetShape: firstReshape, batchInputShape, name: 'layer1'}),
      new Reshape({targetShape: secondReshape, name: 'layer2'})
    ];
    const inputBatch = K.ones([batchSize].concat(inputShape));
    const expectedOutput = K.ones([batchSize].concat(secondReshape));
    const model = new Sequential({layers});
    expectTensorsClose(
        model.predictOnBatch(inputBatch) as Tensor, expectedOutput);
  });

  it('compile() and fit()', async () => {
    const batchSize = 5;
    const inputSize = 4;
    const xs = K.ones([batchSize, inputSize]);
    const ys = K.ones([batchSize, 1]);
    const denseLayer1 = new Dense({
      units: 3,
      useBias: false,
      kernelInitializer: 'Ones',
      inputShape: [inputSize]
    });
    const denseLayer2 =
        new Dense({units: 1, useBias: false, kernelInitializer: 'Ones'});
    const model = new Sequential({layers: [denseLayer1, denseLayer2]});
    model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
    const history = await model.fit({x: xs, y: ys, batchSize, epochs: 2});
    expectTensorsClose(history.history['loss'][0] as Scalar, scalar(121));
    expectTensorsClose(
        history.history['loss'][1] as Scalar, scalar(0.015178224071860313));
  });

  it('Calling evaluate before compile leads to error', () => {
    const batchSize = 5;
    const inputSize = 4;
    const denseLayer1 = new Dense({units: 3, inputShape: [inputSize]});
    const model = new Sequential({layers: [denseLayer1]});
    const xs = K.ones([batchSize, inputSize]);
    const ys = K.ones([batchSize, 1]);
    expect(() => model.evaluate(xs, ys))
        .toThrowError(/needs to be compiled before/);
  });

  it('compile() and evaluate()', () => {
    const batchSize = 5;
    const inputSize = 4;
    const xs = K.ones([batchSize, inputSize]);
    const ys = K.ones([batchSize, 1]);
    const denseLayer1 = new Dense({
      units: 3,
      useBias: false,
      kernelInitializer: 'Ones',
      inputShape: [inputSize]
    });
    const denseLayer2 =
        new Dense({units: 1, useBias: false, kernelInitializer: 'Ones'});
    const model = new Sequential({layers: [denseLayer1, denseLayer2]});
    model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
    const losses = model.evaluate(xs, ys, batchSize) as Scalar;
    expectTensorsClose(losses, scalar(121));
  });
});
// MQTT 클라이언트 설정
var clientId =
  "waterSensorWebClient_" + Math.random().toString(16).substring(2, 8);
var client = new Paho.MQTT.Client(
  "t22e6d86.emqx.cloud",
  Number(8083),
  "/mqtt",
  clientId
);

// 연결 옵션 설정
var options = {
  userName: "min",
  password: "water",
  onSuccess: onConnect,
  onFailure: function (e) {
    console.log("connect fail: " + e.errorMessage);
  },
};

// 클라이언트 연결
client.connect(options);

// 연결 성공 콜백
function onConnect() {
  console.log("connect success");
  client.subscribe("water_level/topic1");
  client.subscribe("water_level/topic2");
  client.subscribe("water_level/topic3");
}

// 메시지 수신 콜백
function onMessageArrived(message) {
  //현재 시간을 얻어옴
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const milliseconds = currentTime.getMilliseconds();

  console.log(
    // "수신된 메시지:",
    // message.payloadString + "messageTopic => " + message.destinationName
    `Message Received (${hours}:${minutes}:${seconds}.${milliseconds}):`,
    message.payloadString + "messageTopic => " + message.destinationName
  );
  if (message.destinationName === "water_level/topic1") {
    addChartData(parseFloat(message.payloadString));
  } else if (message.destinationName === "water_level/topic2") {
    addChartData1(parseFloat(message.payloadString));
  } else if (message.destinationName === "water_level/topic3") {
    addChartData2(parseFloat(message.payloadString));
  }
}

client.onMessageArrived = onMessageArrived;

var config = {
  // type은 차트 종류 지정
  type: "line",
  // data는 차트에 출력될 전체 데이터 표현
  data: {
    // labels는 배열로 데이터의 레이블들
    labels: [],
    // datasets 배열로 이 차트에 그려질 모든 데이터 셋 표현
    datasets: [
      {
        label: "Real-time water meter values 1", //초음파 관련 data
        backgroundColor: "yellow",
        borderColor: "rgb(89, 186, 184)",
        borderWidth: 2,
        data: [], // 각 레이블에 해당하는 데이터
        fill: false,
      },
    ],
  },
  // 차트의 속성 지정
  options: {
    responsive: false, // 크기 조절 금지
    scales: {
      /* x축과 y축 정보 */
      xAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "time" },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "water level meter value" },
        },
      ],
    },
  },
};

var config1 = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Real-time water meter values 2",
        backgroundColor: "yellow",
        borderColor: "rgb(189,131,209)",
        borderWidth: 2,
        data: [],
        fill: false,
      },
    ],
  },
  //차트 속성 지정
  options: {
    Responsive: false, //크기 조절 금지
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "time" },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "water level meter value" },
        },
      ],
    },
  },
};
var config2 = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Real-time water meter values 3",
        backgroundColor: "yellow",
        borderColor: "rgb(240,99,132)",
        borderWidth: 2,
        data: [],
        fill: false,
      },
    ],
  },
  //차트 속성 지정
  options: {
    Responsive: false, //크기 조절 금지
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "time" },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "water level meter value" },
        },
      ],
    },
  },
};

var ctx = null;
var ctx1 = null;
var ctx2 = null;
var ctx3 = null;

var chart = null;
var chart1 = null;
var chart2 = null;
var chart3 = null;

var LABEL_SIZE = 20; // 차트에 그려지는 데이터의 개수
var tick = 0;
var chartTick1 = 0; // 도착한 데이터의 개수임, tick의 범위는 0에서 99까지만
var chartTick2 = 0;
var chartTick3 = 0;
//var tick2 = 0;
function drawChart() {
  ctx = document.getElementById("waterChart1").getContext("2d");
  chart = new Chart(ctx, config);
  init();
  ctx1 = document.getElementById("waterChart2").getContext("2d");
  chart1 = new Chart(ctx1, config1);
  init1();
  ctx2 = document.getElementById("waterChart3").getContext("2d");
  chart2 = new Chart(ctx2, config2);
  init2();
}
// chart의 차트에 labels의 크기를 LABEL_SIZE로 만들고 0~19까지 레이블 붙이기
function init() {
  for (let i = 0; i < LABEL_SIZE; i++) {
    chart.data.labels[i] = i;
  }
  chart.update();
}
function init1() {
  for (let i = 0; i < LABEL_SIZE; i++) {
    chart1.data.labels[i] = i;
  }
  chart1.update();
}
function init2() {
  for (let i = 0; i < LABEL_SIZE; i++) {
    chart2.data.labels[i] = i;
  }
  chart2.update();
}

function addChartData(value) {
  tick++; // 도착한 데이터의 개수 증가
  tick %= 100; // tick의 범위는 0에서 99까지만. 100보다 크면 다시 0부터 시작
  let n = chart.data.datasets[0].data.length;
  if (n < LABEL_SIZE) chart.data.datasets[0].data.push(value);
  else {
    // 새 데이터 value 삽입
    chart.data.datasets[0].data.push(value);
    chart.data.datasets[0].data.shift();
    // 레이블 삽입
    chart.data.labels.push(tick);
    chart.data.labels.shift();
  }
  chart.update();
}

function addChartData1(value) {
  chartTick1++; // 도착한 데이터의 개수 증가
  chartTick1 %= 100; // tick의 범위는 0에서 99까지만. 100보다 크면 다시 0부터 시작
  let n = chart1.data.datasets[0].data.length;
  if (n < LABEL_SIZE) chart1.data.datasets[0].data.push(value);
  else {
    // 새 데이터 value 삽입
    chart1.data.datasets[0].data.push(value);
    chart1.data.datasets[0].data.shift();
    // 레이블 삽입
    chart1.data.labels.push(chartTick1);
    chart1.data.labels.shift();
  }
  chart1.update();
}

function addChartData2(value) {
  chartTick2++; // 도착한 데이터의 개수 증가
  chartTick2 %= 100; // tick의 범위는 0에서 99까지만. 100보다 크면 다시 0부터 시작
  let n = chart2.data.datasets[0].data.length;
  if (n < LABEL_SIZE) chart2.data.datasets[0].data.push(value);
  else {
    // 새 데이터 value 삽입
    chart2.data.datasets[0].data.push(value);
    chart2.data.datasets[0].data.shift();
    // 레이블 삽입
    chart2.data.labels.push(chartTick2);
    chart2.data.labels.shift();
  }
  chart2.update();
}
function addChartData3(value) {
  chartTick3++; // 도착한 데이터의 개수 증가
  chartTick3 %= 100; // tick의 범위는 0에서 99까지만. 100보다 크면 다시 0부터 시작
  let n = chart3.data.datasets[0].data.length;
  if (n < LABEL_SIZE) chart3.data.datasets[0].data.push(value);
  else {
    // 새 데이터 value 삽입
    chart3.data.datasets[0].data.push(value);
    chart3.data.datasets[0].data.shift();
    // 레이블 삽입
    chart3.data.labels.push(chartTick3);
    chart3.data.labels.shift();
  }
  chart3.update();
}

window.addEventListener("load", drawChart); // load 이벤트가 발생하면 drawChart() 호출하도록 등록

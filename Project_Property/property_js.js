var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
        level: 4 // 지도의 확대 레벨
    };

//지도를 미리 생성
var map = new daum.maps.Map(mapContainer, mapOption);
//주소-좌표 변환 객체를 생성
var geocoder = new daum.maps.services.Geocoder();
//마커를 미리 생성
var marker = new daum.maps.Marker({
    position: new daum.maps.LatLng(37.537187, 127.005476),
    map: map
});

var gucode='26530';//법정구코드
function sample5_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            var addr = data.address; // 최종 주소 변수
            gucode = data.sigunguCode;
            // 주소 정보를 해당 필드에 넣는다.
            document.getElementById("sample5_address").value = addr;
            // 주소로 상세 정보를 검색
            geocoder.addressSearch(data.address, function(results, status) {
                // 정상적으로 검색이 완료됐으면
                if (status === daum.maps.services.Status.OK) {
                    var result = results[0]; //첫번째 결과의 값을 활용
                    // 해당 주소에 대한 좌표를 받아서
                    var coords = new daum.maps.LatLng(result.y, result.x);
                    // 지도를 보여준다.
                    mapContainer.style.display = "block";
                    map.relayout();
                    // 지도 중심을 변경한다.
                    map.setCenter(coords);
                    // 마커를 결과값으로 받은 위치로 옮긴다.
                    marker.setPosition(coords)
                }
            });
        }
    }).open();
}


var currentDate = new Date();//date생성
var year = currentDate.getFullYear();
var month = currentDate.getMonth() + 1;
var ym= year.toString()+month.toString();//api요청에 사용하기 위해 string으로 재조합

document.getElementById('button').addEventListener('click', function (){
    var xhr = new XMLHttpRequest();//버튼을 클릭하면 api를 매번 새로운 정보를 이용해 호출하게 되어있음
    var url = 'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev'; /*URL*/
    var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'4w04mUILpusZy2JG1hkWqsK8RhcP2WD40PJhwO2mFWpe6RGSzqF7PE%2F6VNkLakhVz3tl5%2FES8KVjyDA%2B6N0Isg%3D%3D'; /*Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('50'); /**/
    queryParams += '&' + encodeURIComponent('LAWD_CD') + '=' + encodeURIComponent(gucode); //시군구 코드
    queryParams += '&' + encodeURIComponent('DEAL_YMD') + '=' + encodeURIComponent(ym); //오늘 날짜
    xhr.open('GET', url + queryParams);
    var outputDiv = document.getElementById('output');
    outputDiv.innerHTML='';
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var xmlDoc = this.responseXML;
            var items = xmlDoc.getElementsByTagName('item');

            var outputDiv = document.getElementById('output');
            var sum=0;
            for (var i = 0; i < items.length; i++) {
                //api로 리턴받은 xml데이터중 필요한 데이터만 뽑아옴.
                var item = items[i];
                var 거래금액 = item.querySelector('거래금액').textContent;
                sum+=parseInt(거래금액.replace(',',''));//평균거래금액을 구하기위함.
                var 건축년도 = item.querySelector('건축년도').textContent;
                var 아파트 = item.querySelector('아파트').textContent;
                var 도로명 = item.querySelector('도로명').textContent;
                var 년 = item.querySelector('년').textContent;
                var 월 = item.querySelector('월').textContent;
                var 일 = item.querySelector('일').textContent;
                var 전용면적 = item.querySelector('전용면적').textContent;
                var 층 = item.querySelector('층').textContent;
                var 건물번호 = parseInt(item.querySelector('도로명건물본번호코드').textContent).toString();

                //뽑아온 데이터를 박스 형태로 출력
                var outputString = `
                <div class="data-item">
                    <span class="data-field">${아파트}</span>
                    <span class="data-field">${도로명}${건물번호}</span>
                    <span class="data-field">${거래금액}만원</span>
                    <span class="data-field">건축년도: ${건축년도}년</span>
                    <span class="data-field">${년}년 ${월}월 ${일}일</span>
                    <span class="data-field">${전용면적}제곱미터</span>
                    <span class="data-field">${층}층</span>
                </div>`;
                outputDiv.insertAdjacentHTML('beforeend', outputString);
            }
            var avg=sum/items.length;
            alert("검색하신 동네의 평균 거래금액은 "+avg+"만원 입니다.");
            //평균금액 표기
        }
    };
    xhr.send('');
})
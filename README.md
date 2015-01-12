** I'll try to make a document better with English version ** 

## DrawerLayout
Titanium Alloy용 Android의 DrawerLayout 스타일의 Alloy Module.
Alloy Tag로 편하게 사용하게 하기 위해 만들었습니다. 이 프로젝트는 이를 사용하는 예제 프로젝트입니다.

Android에서는 com.tripvi.drawerlayout 모듈을 사용했으며 iOS에서는 ScrollableView를 이용하여 만들었습니다.

이 모듈은 [fokke의 drawer](https://github.com/FokkeZB/nl.fokkezb.drawer)영향을 많이 받았습니다. fokke의 drawer와의 차이점은 Android 스타일의 drawer라는 점입니다. 아래 캡쳐 이미지를 참고하세요.

## 사용법
`DrawerLayout` 태그안에 좌측에 들어갈 View와 화면 가운데 나올 Window를 추가해야합니다.
각각 `role`(leftView, centerWindow)을 아래와 같이 지정해야합니다.

### xml
```
<Alloy>
	<DrawerLayout module="yo.ui"
	onDraweropen="onDrawerOpen"
	onDrawerclose="onDrawerClose"
	>
		<View class="menuWrap" role="leftView">
			<Require id="menuC" src="menu">
			</Require>
		</View>
		<Window platform="ios" role="centerWindow" title="yo.drawer widget">
			<LeftNavButton>
				<View>
					<Button  class="ion-android-menu menuBtn" onClick="onMenuButtonClick"/>
				</View>
			</LeftNavButton>
			<Require src="main" id="mainC">
			</Require>
		</Window>
		<Window platform="android" role="centerWindow">
		    <ActionBar onHomeIconItemSelected="onMenuButtonClick" title="yo.drawer widget" ></ActionBar>
			<Menu>
				<MenuItem id="item1" title="Settings"/>
				<MenuItem id="item2" title="Search"/>
			</Menu>
			<Require src="main" id="mainC">
			</Require>
		</Window>
	</DrawerLayout>
</Alloy>
```

### js
```
function onMenuButtonClick(e){
    $.index.drawer.toggleLeftWindow();
}

function onDrawerOpen(e) {
    Ti.API.info($.index.isLeftDrawerOpen);
}

function onDrawerClose(e) {
    Ti.API.info($.index.isLeftDrawerOpen);
}

function onDrawerSlide(e) {
    // slide offset: e.offset
    console.log(e);
}

$.menuC.on('menuclick',function(e){
    $.index.drawer.toggleLeftWindow({animated:false}); //animated option only work on ios
    if(e.itemId == 'smile'){
        $.index.openWindow(Alloy.createController('smile').getView());
    }else{
        $.index.openWindow(Alloy.createController('cry').getView());
    }
});

$.index.open();
```
 
## 기타 참고사항

- 아직 초기버전을 공유한 것입니다. 자세한 사용법과 관련되서는 시간내서 정리해보겠습니다.
- 위에서 언급했듯이 Android는 https://github.com/manumaticx/Ti.DrawerLayout 를 사용합니다. 이를 설정해야합니다.


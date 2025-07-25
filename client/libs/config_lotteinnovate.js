
		//i18n 설정
		window.mapLang = {
      ko: {
        "mask.title1": "3D 리소스",
        "mask.title2": "메타 데이터",
        "menu.title1": "전경",
        "menu.title2": "계통",
        "menu.title3": "서버실",
        "menu.tooltip1": "전경모드",
        "menu.tooltip2": "계통",
        "menu.tooltip3": "전력",
        "menu.tooltip4": "순환 모드",
        "header.title": "롯데이노베이트",
        "subheader.title": "서울센터 통합 대시보드",
        "action.tooltip1": "애니메이션",
        "action.tooltip2": "가상순찰",
        "action.tooltip3": "알람",
        "action.tooltip4": "슬라이드",
        "action.tooltip5": "로그아웃",
        "left.title1": "센터 전력 현황",
        "left.title2": "VESDA",
        "left.title3": "Generator",
        "left.title4": "UPS & Battery",
        "right.title1": "전산실 전력 현황",
        "right.title2": "PUE 현황",
        "right.title3": "지진계",
        "right.title4": "공조 설비 & 누수",

        "symbol.floor": "1층",
        "symbol.floor2": "2층",
        "symbol.floor3": "3층",
        "symbol.floor4": "4층",
        "serverButton.title1": "1층",
        "serverButton.title2": "2층",
        "serverButton.title3": "3층",
        "serverButton.title4": "4층",
        "billboard.pump.title1": "운전모드",
        "setting.title": "전력/온습도 시각화 설정",
        "setting.title1": "랙 전력사용량",
        "setting.title2": "쿨존-상면 온·습도",
        "setting.title3": "쿨존-상면 히트맵",
        "legend.rack.title": "전력 사용 범례",
        "legend.voltage.title": "전압/전류 범례",
      },
      en: {
        "mask.title1": "3D Resources",
        "mask.title2": "Meta Data",
        "menu.title1": "Home",
        "menu.title2": "System",
        "menu.title3": "Server",
        "menu.tooltip1": "Home",
        "menu.tooltip2": "System",
        "menu.tooltip3": "Server",
        "menu.tooltip4": "Circulation mode",
        "header.title": "LOTTE INNOVATE",
        "subheader.title": "Seoul Center Integrated Dashboard",
        "action.tooltip1": "Animation",
        "action.tooltip2": "Patrol",
        "action.tooltip3": "Alarm",
        "action.tooltip4": "Slide",
        "action.tooltip5": "Log Out",
        "left1.title1": "센터 전력 현황",
        "left1.title2": "VESDA",
        "left.title3": "Generator",
        "left.title4": "UPS & Battery",
        "right.title1": "전산실 전력 현황",
        "right.title2": "PUE 현황",
        "right.title3": "지진계",
        "right.title4": "공조 설비 & 누수",

        "symbol.floor": "1F",
        "symbol.floor2": "2F",
        "symbol.floor3": "3F",
        "symbol.floor4": "4F",
        "serverButton.title1": "1F",
        "serverButton.title2": "2F",
        "serverButton.title3": "3F",
        "serverButton.title4": "4F",
        "billboard.inverter.title1": "Mode",
        "billboard.pump.title1": "Mode",
        "setting.title": "setting.title",
        "setting.title1": "setting.title1",
        "setting.title2": "setting.title2",
        "setting.title3": "setting.title3",
        "legend.rack.title": "Power Usage",
        "legend.voltage.title": "Voltage/Current",
      },
    };
        ///////// rest api polling start
        window.host = './';
        window.apiPrefix = "/api/scenes/1/datasets/";
        window.mockMode = true;
        window.initialDelay = 5e3;

        // 순환 주기 설정 (10000 = 10초, 60000 = 1분)
        // window.circulationInterval = 2e4;     // 전경
        // window.circulationInterval = 2e4;     // 계통
        // window.circulationInterval2 = 1e4;    // 서버
        ///////// rest api polling end
        
        window.dataSetIds = {
            'PUE_전년': '1',
            'PUE_전월': '1',
            'PUE_현재': '1',

            '발전기1': '12', 
            '발전기2': '12', 
            '발전기2': '12', 
        }
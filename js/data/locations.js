// 장소 데이터: 장소를 추가하거나 문구를 수정할 때 이 파일을 편집해요.
export const LOCATIONS = {
      outskirts: {
        name: '외곽', en: 'OUTSKIRTS', category: '마을 바깥 · 시작 지점', group: '마을 바깥',
        description: '여기에는 별다를 것이 없다.\n이 아래로 마을이 넓게 펼쳐져 있다.',
        inspectText: '지면에 작은 물체가 놓여 있다. 은빛을 띠는 씨앗처럼 보인다.',
        evidence: ['은색 씨앗을 획득했다.'],
        connections: ['plaza', 'forest'], inspectLabel: '주변을 조사한다'
      },
      plaza: {
        name: '광장', en: 'SQUARE', category: '마을 중심부', group: '마을 중심부',
        description: '마을 사람들의 수가 기록되어 있다.\n점점 줄어들더니 아무런 기록도 남아 있지 않다.',
        inspectText: '인구 기록은 어느 시점부터 줄어들기 시작한다. 기록의 간격은 일정하지 않으며, 어느 순간부터는 기록 자체가 끊겨 있다.',
        evidence: ['마을 인구 기록이 점차 감소하다가 완전히 중단되었다.'],
        connections: ['outskirts', 'school', 'tower', 'dwelling', 'grandHouse', 'temple', 'well']
      },
      school: {
        name: '학교', en: 'SCHOOL', category: '교육 시설로 추정되는 건물', group: '마을 중심부',
        description: '학교로 추정되는 건물이다.\n아이들의 낙서가 여기저기 남아 있다.',
        inspectText: '아이들의 낙서 중에는 누군가가 선발되는 듯한 그림이 있다.\n사람에게서 날개가 돋아나는 모습을 그린 것처럼 보인다.',
        evidence: ['선발되는 사람과 날개가 돋는 모습을 표현한 낙서.'],
        connections: ['plaza']
      },
      tower: {
        name: '탑', en: 'THE TOWER', category: '마을에서 가장 높은 건축물', group: '마을 중심부',
        description: '마을에서는 가장 높이가 높은 건물이다. 석조 구조물.',
        afterText: '누군가를 가두고 있었던 것 같다. 높은 탑. 최상층부에 종이 달려 있다.',
        inspectText: '감옥 같은 곳이 보인다. 식기는 놓여 있지 않다.\n\n복잡한 수식으로 추정되는 도식들과 함께, 약간의 서류처럼 보이는 것들이 놓여 있다.',
        evidence: ['서류 제목: 「식수원 이동에 관하여」', '서류 제목: 「풍작에 관해」', '서류 제목: 「축제 준비」'],
        connections: ['plaza']
      },
      dwelling: {
        name: '민가', en: 'DWELLING', category: '주거 구역', group: '마을 중심부',
        description: '사람이 살았던 흔적이 남아 있는 집이다.\n방 한쪽에 종이 뭉치가 놓여 있다.',
        inspectText: '누군가의 일기로 보이는 기록이다.\n\n「XXXX를 데려가다니, 신도 야속하시지...\n어디서부터 잘못된 걸까...」',
        evidence: ['일기에서 누군가를 데려간 사건과 그에 대한 상실감을 확인했다.'],
        connections: ['plaza', 'well']
      },
      grandHouse: {
        name: '화려한 집', en: 'GRAND HOUSE', category: '상대적으로 부유했던 가옥', group: '마을 중심부',
        description: '상대적으로 안료 자국이라던지 삭은 직조물들이 많이 놓여 있는 곳이다.',
        inspectText: '고대 주화들이 가득한 곳 사이로, 무언가가 적혀 있다.',
        evidence: [
          '「올해의 천사가 아직도 보이지 않고 있다.」',
          '「파종을 해야 한다.」',
          '「다른 곳에 빼앗길 수는 없다...」',
          '무엇을 빼앗기고 싶어 하지 않는 것일까. 모르겠다.'
        ],
        connections: ['plaza']
      },
      temple: {
        name: '신전', en: 'TEMPLE', category: '종교 시설', group: '마을 중심부',
        description: '여섯 개의 날개를 가진 생물체 그림이 여기저기 석벽에 늘어서 있다.\n인간의 얼굴 같은 가운데 부분은 제각기 생김새가 다르다.',
        inspectText: '생물체의 아래에는 다음과 같은 글이 적혀 있다.',
        evidence: [
          '「ㅁㅁㅁ의 맏이였던 자, 승천하다」',
          '「ㅇㅇㅇ의 막내였던 자, 승천하다」',
          '끝없이 누군가가 승천했다고 적혀 있다. 어딘지 빈 구석이 보인다.'
        ],
        connections: ['plaza', 'templeUnderground', 'graveyard', 'ashSite']
      },
      templeUnderground: {
        name: '신전 지하', en: 'TEMPLE · UNDERGROUND', category: '신전 하부 공간', group: '마을 중심부',
        description: '어두움에도 불구하고 어쩐지 따스함이 느껴지는 공간이다. \n두개골들과 척추뼈들이 늘어서있고, 각각에는 신전에서 보았던 이름과는 다른 게 명패에 새겨져 있다.',
        inspectText: '대다수의 척추뼈가 제대로 성장을 마치지 못하기라도 한 것인지, 크거나 작게 뒤틀린 흔적이 발견된다. 반대로 두개골은 성인의 것을 방불케 할 정도로 크다. 이건 무엇을 의미하는 것일까...',
        phase2: {
          beforeText: '괴이한 두개골과 척추뼈들이 늘어선 공간이다. 명패에 적힌 이름들 또한 도무지 누구를 가리키는 것인지 정확히 알 수 없다.',
          inspectText: `오래된 유골들에서는 특징적인 '유독 크고 비대한' 두개골과 그와 반비례하는 어린이의 여린 척추, 그것도 성장이 중단된 유골들이 주로 관찰되는 반면, \n최근에 매장된 유골들일수록 일반적인 어린이의 두개골 및 척추만이 관찰된다...`
        },
        evidence: [],
        connections: ['temple']
      },
      orchard: {
        name: '과수원', en: 'ORCHARD', category: '마을 외곽의 경작지', group: '경작지와 우물',
        description: '과수원으로 추정되는 땅이다. 돌로 지어진 울타리와 함께,\n풍작을 기원하는 제사가 벌어진 것처럼 여기저기에 제사 도구가 널려 있다.',
        inspectText: '묘한 문양이 삭은 깃발 곳곳에 널려 있다...',
        conditionalText: '은색 씨앗에 그려진 것과 정확히 같은 문양이 삭은 깃발 곳곳에 널려 있다. 무슨 관계가 있는 것이지...?',
        phase2: {
          beforeText: '이 깃발들에 빼곡하게 그려진 각종 문양들은\n이 땅에서 난 씨앗을 표현한 것일까?',
          inspectText: '축제 횟수가 기록된 작은 점토판을 찾았다.\n점토판의 말미로 갈수록 심하게 훼손된 것인지, \n아니면 축제를 질릴 정도로 많이 한 것인지... \n어느 쪽인지 판단하기가 쉽지 않다.'
        },
        evidence: ['삭은 깃발 곳곳에 기묘한 문양이 남아 있다.'],
        connections: ['well']
      },
      well: {
        name: '우물가', en: 'THE WELL', category: '마을 외곽의 우물', group: '경작지와 우물',
        description: '말라붙은 우물이 놓여져 있다.\n주변에는 잡초들이 무성하다.',
        inspectText: '우물 안에는 뼈가 가득하다. 전부 두개골과 척추뼈가 빠져 있다.\n이건 전부... 팔과 다리뼈?',
        phase2: {
          beforeText: '이곳의 우물 안에는 팔과 다리뼈가 들어 있다.',
          inspectText: '우물 안에 버려진 팔과 다리뼈는 전부 뒤틀리지 않은, \n일반적인 아동의 팔과 다리뼈만이 발견되고 있다. \n대체 이건 무엇을 암시하는 것일까?'
        },
        evidence: ['누군가의 뼈를 획득했다.'],
        connections: ['plaza', 'dwelling', 'orchard']
      },
      graveyard: {
        name: '무덤가', en: 'GRAVEYARD', category: '마을에서 멀리 떨어진 한적한 장소', group: '외진 장소',
        description: '일부 무덤이 파헤쳐진 것인지, 묘 곳곳이 비어있는 듯 하다.\n파헤쳐진 무덤에는 하나같이 비석에 낙인으로 추정되는 것이 새겨져 있다.',
        inspectText: '이들에게는 유골을 건드리면 부정을 탄다는 인식이 없던 것일까, 아니면 있던 것일까?\n유골에는 두개골과 척추뼈, 팔과 다리뼈가 사라져 있다.',
        phase2: {
          beforeText: `지금 와서는 파헤쳐진 무덤 대부분의 주인이 아동의 유골이라는 것을 알 것 같다. 성인의 것으로는 생각되지 않는 '작은 뼈들'이 관찰된다.`,
          inspectText: `확실하다. \n새로 생긴 무덤일수록 갈비뼈 근처에 \n'인위적으로 긁어낸 흔적'이 다수 발견된다. \n어쩌면... 이 마을에서 숭배하는 존재는 그저 상상으로 만들어진 게 아닐까.`
        },
        evidence: ['파헤쳐진 무덤과 비석에 새겨진 낙인을 확인했다.', '무덤의 유골에서 두개골과 척추뼈, 팔과 다리뼈가 사라져 있다.'],
        connections: ['temple', 'ashSite']
      },
      ashSite: {
        name: '재가 쌓인 곳', en: 'ASH PILE', category: '무덤 근처의 장소', group: '외진 장소',
        description: '무덤 근처에 있는 재가 쌓인 곳이다.\n어째서 고대인들은 이곳에서 재를 태운 것일까...\n일종의 화장터일 수도.',
        inspectText: '주로 뼈가 태워진 듯, 새하얀 재가 쌓여 있다.',
        conditionalText: '쌓여져 있는 뼈와 이곳에서 굴러다니는 뼈에 새겨진 표식이 일치한다...',
        phase2: {
          beforeText: '뼈에 새겨진 표식들... 이건 무엇을 나타내는 것일까?',
          inspectText: `조사한 결과, '인위적인 표식'과 '자연적인 일그러짐'으로 나뉘는 것을 확인할 수가 있다. 덜 탄 일부 뼈들을 발굴하면 확실해진다. 발육 부진으로 인해 나타나는 뼈의 자연적인 뒤틀림을 인위적으로 흉내낸... 괴기한 조형물들이다.`
        },
        evidence: ['주로 뼈가 태워진 듯한 새하얀 재가 쌓여 있다.'],
        connections: ['graveyard', 'temple']
      },
      forest: {
        name: '숲', en: 'FOREST', category: '마을 외곽의 숲', group: '숲과 절벽',
        description: '돌에 새겨진 진입 금지 표시가 눈에 띈다.',
        inspectText: '숲으로 들어가는 길목에 오래된 진입 금지 표식이 새겨져 있다. 숲 안쪽으로 이어지는 길은 여전히 남아 있다.',
        evidence: ['숲의 진입을 금지하는 오래된 표식.'],
        connections: ['outskirts', 'cliff']
      },
      cliff: {
        name: '숲의 절벽', en: 'FOREST · CLIFF', category: '숲 안쪽의 절벽', group: '숲과 절벽',
        description: '두개골과 척추뼈만 남은 인간 유골로 추정되는 형체가 놓여져 있다.',
        inspectText: '두개골과 척추뼈를 중심으로 한 형체다. 뼈 주변에는 날개처럼 보이는 구조와 여러 갈래로 뻗은 가느다란 흔적이 남아 있다.\n\n일반적인 인간의 유골이라고 보기 어렵다.',
        evidence: ['인간의 유골과 닮았으나 일반적인 해부학적 구조와 다른 형체.'],
        connections: ['forest']
      },
      unknown: {
        name: '???', en: 'UNKNOWN', category: '알 수 없는 장소', group: '???',
        description: '', inspectText: '', evidence: [], connections: []
      }
    };

export const MAP_GROUPS = [
      { name: '마을 중심부', ids: ['plaza', 'school', 'tower', 'dwelling', 'grandHouse'] },
      { name: '우물과 과수원', ids: ['well', 'orchard'] },
      { name: '신전', ids: ['temple', 'templeUnderground'] },
      { name: '외진 묘역', ids: ['graveyard', 'ashSite'] },
      { name: '마을 외곽과 숲', ids: ['outskirts', 'forest', 'cliff'] }
    ];

// 결말에 도달하기 전에 반드시 조사해야 하는 장소예요.
// 새로운 장소를 추가해도 결말 조건에 자동으로 포함되지는 않으니, 필요할 때 이 목록에 추가해요.
export const REQUIRED_LOCATIONS = [
  'outskirts', 'plaza', 'school', 'tower', 'dwelling', 'grandHouse',
  'temple', 'templeUnderground', 'orchard', 'well', 'graveyard', 'ashSite', 'forest', 'cliff'
];

// 두 초기 보고서를 읽은 뒤 다시 방문해 2차 조사를 수행하는 장소들이에요.
export const PHASE2_LOCATIONS = ['orchard', 'templeUnderground', 'graveyard', 'ashSite', 'well'];

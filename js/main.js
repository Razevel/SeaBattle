/*

 Есть баги: 
    из за колбеков в ходе компа, если он выйграл сначала вылетает сообщение о пройгрыше,
  потом закрашивается последний корабль.

    1 раз игра зависла кинув какое-то исключение на то что она не видит функцию. 
    
  

*/


// Получить рандомное целое от min(включительно) до max(не включительно)
// Просто для сокращения
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// Подобие класса, описывающего построитель кораблей
function ShipBuilder( map ) {

  // Если передали не двумерный мссив
  if(map.length == null || map[0].length == null)
  	throw 'Argument(map) exception. map must be an Array[][]';

  // Максимальная координата x и y на карте
  this.xMax = map.length-1;
  this.yMax = map[0].length-1;
  
  // Карта кораблей
  this.map = map;
  

  /*
    Диченная функция проверки
    
      Получает на вход координаты точки от которой строить, размер корабля 1-4 и сторону,
    в которую строить. Возвращает координаты квадрата в котором не должно быть кораблей, 
    если вообще корабль влезает. Если не влезает вернет false

    x1,y1------
    |         |
    |         |
    .------x2,y2
    
    side:
      0 - left    x   y--
      1 - up      x-- y
      2 - right   x   y++
      3 - down    x++ y

    0----y---->
    |
    X
    |
    \/      max

  */  
    this.getBounds = function (x, y, size, side) {
  	
    // Границы 
    var y1, y2, x1, x2;
    
    /*
  
       Проверки, проверки, проверки. Много проверок.


    */

    // Строим корабль ВЛЕВО от точки x,y на size ячеек
  	if(side == 0){
  		
  		// Если последняя ячейка корабля ВЫХОДИТ за границы карты слева
  		if( (y - (size-1)) < 0 )
  			return false;

  		// Если последняя ячейка корабля НА границе карты слева
  		if( (y - (size - 1)) == 0 ){
  			y1 = 0;

  			// Если начальная точка не на правом краю карты
  			if(y<this.yMax)
  				y2 = y+1;
  			// Если начальная точка на правом краю карты (если корабль 10 ячеек)
  			else
  				y2 = y;

  		// Если последняя ячейка корабля в другом месте карты
  		}else{
  			y1 = y-size;
				
				// Если начальная точка не на нижнем краю карты
  			if(y<this.yMax)
  				y2 = y+1;
  			// Если начальная точка на нижнем краю карты (если корабль 10 ячеек)
  			else
  				y2 = y;
  		}

  		// Если начальная ячейка корабля НА границе карты сверху
  		if( x == 0){
  			x1 = 0;
  			x2 = 1;
  		}
  		// Если начальная ячейка корабля НА границе карты снизу
  		else if(x == this.xMax){
  			x1 = x-1;
  			x2 = x;
  		// Если начальная ячейка корабля НЕ на границах по вертикали
  		}else{
  			x1 = x-1;
  			x2 = x+1;
  		}

  	// Строим корабль ВВЕРХ от точки x,y на size ячеек
  	}else if(side == 1){
  		
  		// Если последняя ячейка корабля ВЫХОДИТ за границы карты сверху
  		if( (x - (size-1)) < 0 )
  			return false;

  		// Если последняя ячейка корабля НА границе карты сверху
  		if( (x - (size-1)) == 0 ){
  			x1 = 0;
  			
  			// Если начальная точка не на нижнем краю карты
  			if(x < this.xMax)
  				x2 = x+1;
  			// Если начальная точка на нижнем краю карты
  			else
  				x2 = x;
  		
  		// Если последняя ячейка корабля НЕ на границе карты сверху
  		}else{
  			x1 = x - size;

  			// Если начальная точка не на нижнем краю карты
  			if(x<this.xMax)
  				x2 = x+1;
  			// Если начальная точка на нижнем краю карты
  			else
  				x2 = x;
  		}

  		// Если начальная ячейка корабля НА границе карты слева
  		if( y == 0){
  			y1 = 0;
  			y2 = 1;
  		}
  		// Если начальная ячейка корабля НА границе карты справа  		
  		else if(y == this.yMax){
  			y1 = y-1;
  			y2 = y;
  		// Если начальная ячейка корабля не на границах карты по горизонтали
  		}else{
  			y1 = y-1;
  			y2 = y+1;
  		}

  	// Строим корабль ВПРАВО от точки x,y на size ячеек
  	}else if(side == 2){
  		// Если последняя ячейка корабля ВЫХОДИТ за границы карты справа
  		if( (y + (size-1)) > 9 )
  			return false;

  		// Если последняя ячейка корабля НА границе карты справа
  		if( (y + (size-1)) == 9 ){
  			y2 = (y + size);

  			// Если начальная точка НЕ на левой краю карты
  			if(y>0)
  				y1 = y-1;
  			// Если начальная точка НА левой краю карты
  			else
  				y1 = y;
  		// Если последняя ячейка корабля НЕ НА границе карты справа
  		}else{
  			y2 = y + size;

  			// Если начальная точка НЕ на левой краю карты
  			if(y>0)
  				y1 = y-1;
  			// Если начальная точка НА левой краю карты
  			else
  				y1 = y;
  		}

  		// Если начальная ячейка корабля НА границе карты сверху
  		if( x == 0){
  			x1 = 0;
  			x2 = 1;
  		}  		
			// Если начальная ячейка корабля НА границе карты снизу
  		else if(x == this.xMax){
  			x1 = x-1;
  			x2 = x;
  		// Если начальная ячейка корабля НЕ на границах по вертикали
  		}else{
  			x1 = x-1;
  			x2 = x+1;
  		}

  	// Строим корабль ВНИЗ от точки x,y на size ячеек  	
  	}else if(side == 3){
  		
  		// Если последняя ячейка корабля ВЫХОДИТ за границы карты снизу
  		if( (x + (size-1)) > this.xMax )
  			return false;

  		// Если последняя ячейка корабля НА границе карты снизу
  		if( (x + (size-1)) == this.xMax ){
  			x2 = this.xMax;
  			
  			// Если начальная точка не на верхнем краю карты
  			if(x>0)
  				x1 = x-1;
				
        // Если начальная точка на верхнем краю карты
  			else
  				x1 = x;

  		// Если последняя ячейка корабля НЕ на границе карты снизу  		
  		}else{
  			x2 = x + size;

  			// Если начальная точка не на верхнем краю карты  			
  			if(x>0)
  				x1 = x-1;
				
        // Если начальная точка на верхнем краю карты  			
  			else
  				x1 = x;
  		}

  		// Если начальная ячейка корабля НА границе карты слева
  		if( y == 0){
  			y1 = 0;
  			y2 = 1;
  		}
  		// Если начальная ячейка корабля НА границе карты справа
  		else if(y == this.yMax){
  			y1 = y-1;
  			y2 = y;
  		// Если начальная ячейка корабля не на границах карты по горизонтали 
  		}else{
  			y1 = y-1;
  			y2 = y+1;
  		}

  	}else {
  		throw 'Argument(side) exception. side must be int in range from 0 to 3';
  	}
    
  	return {
  		x1: x1,
      y1: y1,
      y2: y2,
  		x2: x2,
      x: x,
      y: y,
      size: size,
      side: side
  	};
  }.bind(this);


  // Проверяет, пусты ли границы, чтобы туда вместить корабль
  var tryBounds = function ( x1, y1, x2, y2, x, y, size, side) { 
    // Если хоть в одной ячейке из всего прямоугольника не пусто (не 0или1),
    // то этот прямоугольник не подходит

    for (var i = x1; i <= x2; i++){ 
      for (var j = y1; j <= y2; j++){
        if( !(this.map[i][j] === 0) )
          return false;
      }
    }
    
    return {
      x1: x1,
      y1: y1,
      y2: y2,
      x2: x2,
      x: x,
      y: y,
      size: size,
      side: side
    };
  }.bind(this);


  // Отмечает на карте корабль
  var addToMap = function ( x1, y1, x2, y2, x, y, size, side) {
    
    // Чтобы отрисовался прижатый к стене корабль

    if(side == 0){
      for (var i = y; i > y-size; i--)
        this.map[x][i] = 1;

    }else if( side == 1){
      for (var i = x; i > x-size; i--)
        this.map[i][y] = 1;

    }else if( side == 2){
      for (var i = y; i < y+size; i++)
        this.map[x][i] = 1;

    }else if( side == 3){
      for (var i = x; i < x+size; i++)
        this.map[i][y] = 1;
    }
  }.bind(this);


  // Публичный метод для рандомного размещения корабля размера size
	this.placeShip = function (size) {
	  
	  var x, // Начальная координата x
	  		y, // Начальная координата y
	  		side, // Сторона
	  		isValid = false; // Можно ли так разместить корабль
	  
    // Пока место не подходит для размещения, выбирать новое
		while(!isValid){
			x = getRandom(0, 10);
			y = getRandom(0, 10);
      // В какую сторону строить
			side = getRandom(0, 4);

      // Получить коры границ размещения корабля
      var b = this.getBounds(x, y, size, side);
      if(b == false)
        isValid = false;
      else        
        // Смотрим, есть ли там уже корабли
			  isValid = tryBounds(b.x1, b.y1, b.x2, b.y2, b.x, b.y, b.size, b.side);
		}
    b = isValid;
    // Размещаем корабль
    addToMap( b.x1, b.y1, b.x2, b.y2, b.x, b.y, b.size, b.side );
	};

};


/* --- Логика игры --- */
function Game( name ) {

  // Имя пользователя
  this.userName = name, 

  // Карты кораблей. Массивы 10х10. 0-пусто, 1-есть+живой, 2-стреляли+мимо 3-стреляли+взорвали
  this.userShipMap, 
  this.compShipMap, 

  // Html разметка 
  this.fieldsWrapper, // div.row для колонок с полями
  this.userField, // div.col для поля пользователя
  this.compField, // div.col для поля компьютера
  this.infobox, // h4, заголовок, чей ход

  // Чей сейчас ход. 0 - user; 1 - comp
  this.whosTurn; 

  // Идёт ли игра
  this.isStart = false;

  // Время раздумия компьютера = +-compMoveTime*1000ms
  this.compMoveTime = 1;
  


  // Создает двумерный массив x на y, со значениями '0', значит что ячейка свободна
  var createShipMap = function (x, y) {    
    var arr = Array(x);

    for (var i = 0; i < x; i++) {
      arr[i] = Array(0);
      for (var j = 0; j < y; j++) {
        arr[i][j] = 0;
      }
    }
    return arr;
  }


  // Создание карты кораблей для 2х игроков и расстановка кораблей
  var init = function () {
    
    this.userShipMap = createShipMap(10, 10);
    var userSB = new ShipBuilder(this.userShipMap);
    for (var i = 0; i < 4; i++) {
      for (var j = 4-i; j > 0; j--) {
        userSB.placeShip(j);
      }
    }

    this.compShipMap = createShipMap(10, 10);
    var compSB = new ShipBuilder(this.compShipMap);
    for (var i = 0; i < 4; i++) {
      for (var j = 4-i; j > 0; j--) {
        compSB.placeShip(j);
      }
    }
  }.bind(this);


  // делает поле квадратным  
  var adaptField = function (field) {
    field = field.find('table');
    field.css('height', field.width());
  };


  // Отрисовывает карту с кораблями
  var renderField = function (field, map, isMy) {

    var arr = field.find('tr');
    
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[i].length; j++) {
        // Если поле моё, я вижу расположение кораблей
        if(isMy){
          if(map[i][j] === 1){
            $($(arr[i]).find('td').toArray()[j]).addClass('ship');
          }  
        }
        // Клетка в которую стрелял и там мимо
        if(map[i][j] === 2){
          $($(arr[i]).find('td').toArray()[j]).addClass('miss');
        }
        // Взорванный корабль
        if(map[i][j] === 3){
          $($(arr[i]).find('td').toArray()[j]).addClass('boom');
        }
      }
    }
  }


  // Создает дочерний элемент указанного типа с ид и классами для родителя
  var createControll = function(parent, selector, classes, id) {
    
    var newChild = $(document.createElement(selector));
    newChild.addClass(classes);
    
    if( id != null )
      newChild.attr('id', id);

    $(parent).append(newChild);

    return newChild;
  }


  // Создает HTML разметку под поле - таблицу 10х10, добавляет заголовок чьё это поле,
  // делает поле квадратным
  // вешает обработчик на событие изменения размера окна
  var createField = function(parent, selector, classes, id, title) {
    
    // Создает wrapper>h+table>tr*10>td*10
    var wrapper = createControll(parent, selector, classes, id);
    createControll(wrapper, 'h6').text(title);
    var table = createControll(wrapper, 'table');
    
    for (var i = 0; i < 10; i++) {
      var tr = createControll(table, 'tr');
      for (var j = 0; j < 10; j++) {
        createControll(tr, 'td');
      }
    }
    
    // делает поле квадратным
    adaptField(wrapper);
    $(window).on('resize', function() { adaptField(wrapper) });
    return wrapper;
  }


  // Проверяет, не разбит ли корабль полностью,
  // Если нет - вернет false.
  // Если да, то вернет коры прямоугольника вокруг корабля.
  // Вызывает ShipBuilder.GetBounds(x,y,size, side)
  var isShipDie = function (map, x, y) {

    var coors = false;

    // Если корабль вертикальный
    var _vertical = function (map, x, y) {
      var size = 0, side = 3, x0 = x, bounds;
      
      while(x0>=0 && map[x0][y]==3){
        x0--;
      }
      if(x0>=0 && map[x0][y] == 0) {
        x0++;
        var tmp = x0;
        while(tmp<=9 && map[tmp][y]==3){
          tmp++;
          size++
        }        
        if(map[tmp][y]==0){
          bounds = (new ShipBuilder( map )).getBounds(x0, y, size, side);
          return bounds;
        }
      }
      return false;    
    };

    // Если корабль горизонтальный
    var _horizontal = function (map, x, y) {
      var size = 0, side = 2, y0 = y, bounds;
      
      while(y0>=0 && map[x][y0]==3){
        y0--;
      }
      if(y0>=0 && map[x][y0] == 0) {
        y0++;
        var tmp = y0;
        while(tmp<=9 && map[x][tmp]==3){
          tmp++;
          size++
        }        
        if(map[x][tmp]==0){
          bounds = (new ShipBuilder( map )).getBounds(x, y0, size, side);
          return bounds;
        }
      }
      return false; 
    };

    // Тут проверяется, есть ли у корабля еще палубы вертикально или горизонтально
    // Если корабль вертикальный
    if( (x==0 && map[x+1][y] == 3) ||
        (x==map.length-1 && map[x-1][y] == 3) ||
        ((x>0&&x<map.length-1) && map[x-1][y] == 3) ||
        ((x>0&&x<map.length-1) && map[x+1][y] == 3)
        )
    {
      coors = _vertical(map, x, y);
    }
    // Если корабль горизонтальный
    else if((y==0 && map[x][y+1] == 3) ||
            (y==map[0].length-1 && map[x][y-1] == 3) ||
            ((y>0&&y<map[0].length-1) && map[x][y-1] == 3) ||
            ((x>0&&x<map[0].length-1) && map[x][y+1] == 3)
      )
    {  
        coors = _horizontal(map, x, y);
    }
    // Если однопалубник
    else {
      // Сверху
      if(x === 0){
        // Слева
        if(y === 0){
          if( (map[x+1][y] == 0 || map[x+1][y] == 2) && (map[x][y+1] == 0 || map[x][y+1] == 2)){
            var sb = new ShipBuilder(map);
            coors = sb.getBounds(x, y, 1, 3);
          }
        }
        // Справа
        else if(y === map[0].length-1){
          if( (map[x][y-1] == 0 || map[x][y-1] == 2) &&  (map[x+1][y] == 0 || map[x+1][y] == 2)){
            var sb = new ShipBuilder(map);
            coors = sb.getBounds(x, y, 1, 3);
          }
        // В середине          
        }else{
          if( (map[x][y-1] == 0 || map[x][y-1] == 2) && (map[x][y+1] == 0 || map[x][y+1] == 2) &&  (map[x+1][y] == 0 || map[x+1][y] == 2)){
            var sb = new ShipBuilder(map);
            coors = sb.getBounds(x, y, 1, 3);
          }
        }  
      // Снизу        
      }else if(x === map.length-1){
        // Слева   
        if(y === 0){
          if( (map[x-1][y] == 0 || map[x-1][y] == 2) && (map[x][y+1] == 0 || map[x][y+1] == 2)){
            var sb = new ShipBuilder(map);
            coors = sb.getBounds(x, y, 1, 3);
          }

        // Справа
        }else if(y === map[0].length-1){
          if( (map[x][y-1] == 0 || map[x][y-1] == 2) &&  (map[x-1][y] == 0 || map[x-1][y] == 2)){
            var sb = new ShipBuilder(map);
            coors = sb.getBounds(x, y, 1, 3);
          }
        // В середине
        }else{
          if( (map[x][y-1] == 0 || map[x][y-1] == 2) && (map[x][y+1] == 0 || map[x][y+1] == 2) &&  (map[x-1][y] == 0 || map[x-1][y] == 2)){
            var sb = new ShipBuilder(map);
            coors = sb.getBounds(x, y, 1, 3);
          }
        }
      // В середине
      }else{
        // Слева
        if(y === 0){
          if( (map[x-1][y] == 0 || map[x-1][y] == 2) && (map[x+1][y] == 0 || map[x+1][y] == 2) && (map[x][y+1] == 0 || map[x][y+1] == 2)){
            var sb = new ShipBuilder(map);
            coors = sb.getBounds(x, y, 1, 3);
          }
        // Справа
        }else if(y === map[0].length-1){
          if( (map[x][y-1] == 0 || map[x][y-1] == 2) &&  (map[x-1][y] == 0 || map[x-1][y] == 2) &&  (map[x+1][y] == 0 || map[x+1][y] == 2)){
            var sb = new ShipBuilder(map);
            coors = sb.getBounds(x, y, 1, 3);
          }
        // В середине
        }else{
          if( (map[x][y-1] == 0 || map[x][y-1] == 2) && (map[x][y+1] == 0 || map[x][y+1] == 2) &&  (map[x-1][y] == 0 || map[x-1][y] == 2) && (map[x+1][y] == 0 || map[x+1][y] == 2)){
            var sb = new ShipBuilder(map);
            coors = sb.getBounds(x, y, 1, 3);
          }
        } 
      }
    }
    

    return coors;
  }.bind(this);


  // Ход компа (не работает)
  // TODO: усложнить, чтобы он добивал корабль, если попал в него.
  var computerMove = function () {
    if(this.isStart && this.whosTurn == 1){  
      var isMiss = true;
      // Интервалы для обдумывания
            
      var isValid = false, x, y;
      
      // Поиск не чекнутых координат
      while(!isValid){
        x = getRandom(0, 10);
        y = getRandom(0, 10);
        isValid = (this.userShipMap[x][y] != 2 && this.userShipMap[x][y] != 3);
      }
      
      // Если промазал, то чекаем что бил в эту ячейку
      if( this.userShipMap[x][y] == 0 ){
        this.userShipMap[x][y] = 2
      }
      // Если попал, то отмечаем что этот корабль взорван
      else if(this.userShipMap[x][y] == 1){
        this.userShipMap[x][y] = 3;
        
        // Закрашиваем его поля
        var bounds = isShipDie(this.userShipMap, x,y);
        if( bounds ){
          for (var i = bounds.x1; i <= bounds.x2; i++) {
            for (var j = bounds.y1; j <= bounds.y2; j++) {
              if(this.userShipMap[i][j] != 3)
                this.userShipMap[i][j] = 2;
            }
          }
        }

        isMiss = false;
      }
      
      // Таймаут на раздумия
      setTimeout(function () {      
        this.infobox.text('Компьютер думает');
      }.bind(this), this.compMoveTime*800);

      setTimeout(function () {      
        renderField(this.userField, this.userShipMap);        
          // Если попал ходит еще
          if(isMiss){
            this.whosTurn = 0;
            this.infobox.text('Ваш ход');
          }else{
            computerMove();
          }
        
      }.bind(this), this.compMoveTime*1600);

      // Проверяем, не победил ли
      checkEnd();
    }    
  }.bind(this);


  // Проверяем, не победил ли игрок, чей сейчас ход
  var checkEnd = function() {

    // Поиск живых кораблей на карте
    function findShips(arr, value) {
      
      for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
          if(arr[i][j] === value)
            return true;
        }
      }
      return false;
    }

    // Если ход компа, то смотрим есть ли у игрока живые корабли
    if( this.whosTurn === 1 && !findShips(this.userShipMap, 1)){
      this.isStart = false;
      alert('Игра окончена!\nНа этот раз, технологии победили');
      document.location.href = "index.html";
    }
    // Если ход игрока, то смотрим есть ли у компа живые корабли
    else if( this.whosTurn === 0 && !findShips(this.compShipMap, 1)){
      this.isStart = false;
      alert('Поздравляю, ' + this.userName + '! \nВы выйграли!');
      document.location.href = "index.html";
    }
  }.bind(this);


  // Публичный матод для обработки хода игрока
  this.DoMove = function(x, y){
    if( this.isStart && this.whosTurn==0 ){
      var isMiss = true;

      // Если уже стрелял
      if( this.compShipMap[x][y] == 2 || this.compShipMap[x][y] == 3 ){
        return false;

      // Если пусто показать что сюда стрелял
      }else if(this.compShipMap[x][y] == 0){
        this.compShipMap[x][y] = 2;      
        renderField(this.compField, this.compShipMap);

      // Если не пусто, показать что взорвал корабль, оставляем ход игроку
      }else if(this.compShipMap[x][y] == 1){
        this.compShipMap[x][y] = 3;      
        renderField(this.compField, this.compShipMap);
        isMiss = false;
      }

      checkEnd();

      // Смена хода
      if(isMiss){
        this.infobox.text('Ход противника');
        this.whosTurn = 1;      
        computerMove();
      }

      // Всё удачно, ход совершен
      return true;
    }
    return false;
  }


  /* --- Начало игры 
  Создает 
    1) карту кораблей для пользователя и компьютера;
    2) HTML разметку под поля (.row > .col#userField>table>tr*10>td*10 +.col#compField>table>tr*10>td*10).
  */
  this.Start = function () {
    
    // Для отображения чей ход
    var div = createControll(createControll($('main'), 'div', 'row'), 'div', 'col-12 col-md-6 mb-7');
    this.infobox = createControll(div, 'h4', '');

    // бутстрап сетка для нормального отображения полей на разных устройствах 
    this.fieldsWrapper = createControll($('main'), 'div', 'row justify-content-around fields mb-2');
    
    // HTML разметка для полей
    this.userField = createField(this.fieldsWrapper, 'div', 'col-12 col-md-6 mt-3 md-5', 'userField', 'Ваше поле');
    this.compField = createField(this.fieldsWrapper, 'div', 'col-12 col-md-6 mt-3 md-5', 'compField', 'Поле компьютера');
    
    // Заполнение карты
    init();
    this.isStart = true;

    // Отрисовка полей
    renderField(this.userField, this.userShipMap, true);
    renderField(this.compField, this.compShipMap, false);    


    // Выбор хода
    this.whosTurn = getRandom(0, 2);
    if(this.whosTurn == 0)
      this.infobox.text('Ваш ход');
    else{
      this.infobox.text('Ход противника');
      computerMove()
    }
  }
}





// Загрузка, экранчики меняются, ни на что не влияет
function load() {
  
  setTimeout(function() {$('.intro-you').remove();}, 1200);  
  setTimeout(function () {
    $('#loading1').show(400);
  }, 300);

  setTimeout(function () {
    $('#loading1').hide(500);
  }, 1100);

  setTimeout(function () {
    $('#loading2').show(400);;
  }, 1600);

  setTimeout(function () {
    $('#loading2').hide(400);
  }, 2600);

  setTimeout(function () {
    $('#loading3').show(500);
  }, 3000);

  setTimeout(function () {
    $('#loading3').hide(400);
  }, 3900);

  setTimeout(function () {
    $('#loading1').remove();
    $('#loading2').remove();
    $('#loading3').remove();
  }, 4500);
  

}








// doc.ready
$(function(){

  var game;
  $('#loading1').hide(0);
  $('#loading2').hide(0);
  $('#loading3').hide(0);
  $('#compMoveTime').hide(0);

  // debugger;
	
	// Игрок ввел имя и нажал играть


	$('.intro-you #play-btn').on('click', function(){
		var name = $('.intro-you input').val();
		if(name !== ''){
			$('.intro-you').hide(800);
      game = new Game( name );
      load();
      setTimeout(function () {        
        game.Start();
        $('#compMoveTime').show(150);
        $('#compField td').on('click', function(){
          
          var colIndex = $(this).prevAll().length;
          var rowIndex = $(this).parent('tr').prevAll().length;
          if(!game.DoMove(rowIndex, colIndex))
            alert('Не Ваш ход или уже стреляли!');

        });
        $('#compMoveTime').on('click', function() {
          if(game.compMoveTime === 1){            
            game.compMoveTime = 0;
            $('#compMoveTime').removeClass('active');
          }else{            
            game.compMoveTime = 1;
            $('#compMoveTime').addClass('active');

          }
        })
      }, 4500);
    	
		}else{
			alert('Каждого как-нибудь зовут!');
		}
	});


});


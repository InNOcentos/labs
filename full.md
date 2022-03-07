## l1 - Сортировка перемешиванием:
  - По сути оптимизированный вариант сортировки пузырьком. За один проход в конец массива всплывает максимальный элемент из диапазона, а за следующий проход в начало массива - минимальный. Эти элементы больше не рассматриваются и таким образом диапазон сужается с двух сторон.

  - Сложность - O(n^2)
  
  - Функция shakeSort принимает массив, устанавливает начало и конец массива (перменные left и right), hasSwapped - если мы поменяли элемент местами, loopIterationCount - счетчик на каждой итерации
  - До тех пор пока left < right - увеличиваем счетчик, пробегаемся сначала циклом от начала до конца и если элемент arr[i] больше arr[i+1] - мы меняем их местами
  - После прохождения цикла от начала до конца - сдвигаем конец на один элемент назад
  - Далее проходимся циклом от конца до начала (конец уже сдвинут) и если arr[i] меньше arr[i-1] - меняем их местами (меньший элемент уходит в начало массива)
  - После прохождения цикла от конца до начала - сдвигаем начало на один элемент вперед
  - Если за оба цикла не произошло свапа элементов - мы просто возвращаем массив(если массив уже отсортирован или мы изначально дали отсортированный массив)

  Функция swap соответственно меняет элементы местами

## l2 - Сортировка слиянием:
  - Разбиваем массив на два более мелких, затем каждый из них еще раз делим на два более мелких и так далее пока не останутся части из одного элемента
  - Слияние в правильном порядке всех мелких частей снова в более и более крупные и получение в итоге единого отсортированного массива

  - Сложность O(nlogn)

  - Функция mergeSort принимает массив, определяем середину, левый массив и правый массив. Вызываем функцию merge с рекурсивно вызванной функцией mergeSort для двух массивов.
  - Функция merge принимает два массива и сравнивает их элементы, формирует новый массив из уже отсортированных
<div>
显示列:
- <a class="toggle-vis" data-column="0">表达、词语</a>
- <a class="toggle-vis" data-column="1">解释</a>
- <a class="toggle-vis" data-column="2">课次</a>
- <a class="toggle-vis" data-column="3">序</a>
</div>

| 表达、词语             | 解释                     | 说明                    | 课次               | 序              |
| ----                   | ----                     | ----                    | ----               | --              | {% for expression in site.data.expressions %}
| {{expression.expression}} | {{expression.shortexplain}} | {{expression.explanation}} | {{expression.lesson}} | {{expression.idx}} | {% endfor %}
| ====                   | ====                     | ====                    | ====               | ==              |
| 表达、词语             | 解释                     | 说明                    | 课次               | 序              |
{:.display.table.table-striped.table-bordered width="100%"}

<script>
$(document).ready(function() {
  $('a.toggle-vis').on('click', function(e) {
    e.preventDefault();
    var column = table.column( $(this).attr('data-column') );
    column.visible(!column.visible());
  });
  function inittable() {
    table.column(4).visible(false);
    table
      .order( [4, 'asc'] )
      .draw();
  }
  setTimeout(inittable, 300);
  $('table tbody tr td:nth-child(1)')
  .each(function() {
    $(this).addClass('japan');
  });
  $('table tbody tr td:nth-child(2)')
  .each(function() {
    $(this).html($(this).html().replace(/\\n/g, "<br />"));
  });
  $('table tbody tr td:nth-child(3)')
  .each(function() {
    $(this).html($(this).html().replace(/\\n/g, "<br />"));
  });
});
</script> 
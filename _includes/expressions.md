<div>
<strong>显示列:</strong>
<a class="toggle-vis btn btn-xs btn-default" data-column="0">表达、词语</a>
<a class="toggle-vis btn btn-xs btn-default" data-column="1">解释</a>
<a class="toggle-vis btn btn-xs btn-default" data-column="2">课次</a>
<a class="toggle-vis btn btn-xs btn-default" data-column="3">序</a>
</div>

<table class="display table table-striped table-bordered" width="100%">
  <thead>
    <tr>
      <th>表达、词语</th>
      <th>解释</th>
      <th>说明</th>
      <th>课次</th>
      <th>序</th>
    </tr>
  </thead>
  <tbody>{% for expression in site.data.expressions %}
    <tr>
      <td>{{expression.expression}}</td>
      <td>{{expression.shortexplain}}</td>
      <td>{{expression.explanation}}</td>
      <td>{{expression.lesson}}</td>
      <td>{{expression.idx}}</td>
    </tr>{% endfor %}
  </tbody>
  <tfoot>
    <tr>
      <td>表达、词语</td>
      <td>解释</td>
      <td>说明</td>
      <td>课次</td>
      <td>序</td>
    </tr>
  </tfoot>
</table>

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
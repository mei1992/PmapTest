/**
 * Created by limei on 2017/10/12.
 */
export function createPopupDom(title,input_name,input_content,confirm,cancel) {

  var div = document.createElement('div')
  div.className = 'pop_box'
  div.style.width = '240px'
  div.style.padding = '5px'

  var popTitle = document.createElement('h2')
  popTitle.className = "pop_title"
  popTitle.innerText = title

  div.appendChild(popTitle)

  var label1 = document.createElement('span')
  label1.innerText = '名称:'

  div.appendChild(label1)

  var nameInput = document.createElement('input')
  nameInput.id = '_marker_name'
  nameInput.className = 'name_input'
  nameInput.placeholder = input_name
  nameInput.type = 'text'

  div.appendChild(nameInput)

  var space = document.createElement('br')
  div.appendChild(space)

  var label2 = document.createElement('span')
  label2.innerText = '描述:'

  div.appendChild(label2)

  var descInput = document.createElement('textarea')
  descInput.id = '_marker_desc'
  descInput.className = 'desc_box'
  descInput.placeholder = input_content

  div.appendChild(descInput)

  var buttonWrap = document.createElement('div')
  buttonWrap.style.padding = '3px 0'
  buttonWrap.style.textAlign = 'center'

  var confirmInput = document.createElement('button')
  confirmInput.className = 'pop_btn'
  confirmInput.onclick = confirm
  confirmInput.innerText = '确定'

  buttonWrap.appendChild(confirmInput)

  var cancelInput = document.createElement('button')
  cancelInput.className = 'pop_btn'
  cancelInput.style.marginLeft = '5px'
  cancelInput.onclick = cancel
  cancelInput.innerText = '取消'

  buttonWrap.appendChild(cancelInput)

  div.appendChild(buttonWrap)

  return div;
}

export function createPoiMarker(name,addr) {
  var div = document.createElement('div')
  div.className = 'poi_marker'
  div.style.width = 'auto'

  var p_name = document.createElement('span')
  p_name.innerText = name

  div.appendChild(p_name)

  if(addr){
    var space = document.createElement('br')
    div.appendChild(space)

    var p_addr = document.createElement('span')
    p_addr.innerText = addr

    div.appendChild(p_addr)
  }

  return div;
}


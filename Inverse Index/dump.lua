# https://stackoverflow.com/questions/9168058/how-to-dump-a-table-to-console/27028488#27028488
local function dump(o)
  if type(o) == 'table' then
    local s = '{ '
    for k,v in pairs(o) do
      if type(k) ~= 'number' then k = '"'..k..'"' end
      s = s .. dump(v) .. ', '
    end
    return s .. '} '
  else
    return tostring(o)
  end
end

return dump

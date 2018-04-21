local function find(a, t)
  for _,a_ in ipairs(t) do 
    if a_== a then 
      return true 
    end 
  end
end

local function intersect(a, b)
  local ret = {}
	for _,b_ in ipairs(b) do
		if find(b_,a) then 
      table.insert(ret, b_)
    end
	end
	return ret
end

function union(a, b)
	a = {unpack(a)} -- clone a, so we don't accidentally modifiy the original table
	for _, b_ in ipairs(b) do
		if not find(b_, a) then 
      table.insert(a, b_)
    end
	end
	return a
end


return {
  intersect = intersect,
  union = union
}
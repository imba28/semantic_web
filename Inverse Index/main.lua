local fs = require("lfs")

local index = {}

function setupIndex()
  local resource_path = lfs.currentdir() .. "/Inverse Index/resource"
  
  for file in fs.dir(resource_path) do
  if file ~= "." and file ~= ".." then
    for line in io.lines(resource_path .. "/" .. file) do
      for i in string.gmatch(line, "%S+") do
        local word = string.match(i, "[a-zA-Z0-9]+") -- filter chars and digits 
        if word and #word > 1 then -- if not nil and length > 1
          word = string.lower(word)
          if not index[word] then
            index[word] = {}
          end

          table.insert(index[word], file)
        end
      end
    end
  end
end
end

setupIndex()